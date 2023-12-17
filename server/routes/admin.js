const express = require("express");
const app = express();
const multer = require('multer');
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
// const connectDB = require("../config/db");
// connectDB();
const adminlayout = "../views/layouts/admin";
const bodyparser = require('body-parser'); //Xử lý ảnh
const nodemailer = require("nodemailer"); // Send mail

app.use(bodyparser.urlencoded({
  extended:true
}));

var storage = multer.diskStorage({
  destination:function(req, file, cb){
    if( file.mimetype === "image/jpg"||
        file.mimetype === "image/jpeg"||
        file.mimetype === "image/png"){
          cb(null,'public/images');
        } else {
          cb(new Error('Not image'), false);
        }
  },
  filename:function(req, file, cb){
    cb(null, Date.now()+'.jpg');
  }
});
var upload = multer({storage:storage});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'htluc3012@gmail.com',
    pass: 'wsca ycog ttpo btan'
  }
});


/* GET
HOME 
*/
router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Blog website - admin",
      description: "Blog website created with Nodejs, express, mongodb",
    };
    res.render("admin/login", {
      locals,
    });
  } catch (error) {
    console.log(error);
  }
});

/* GET
ABOUT
*/

router.get("/about", (req, res) => {
  const locals = {
    title: "About",
    description: "Information about us",
  };
  res.render("about", { 
    locals,
  });
});

/* GET
CONTACT
*/

router.get("/contact", (req, res) => {
  const locals = {
    title: "Contact",
    description: "Please follow us and leave your contact",
  };
  res.render("contact", { 
    locals,
  });
});

/* POST
CONTACT
*/

router.post('/contact', (req, res) => {
  const { title, body } = req.body;

  if (!title || !body) {
    // Nếu một trong các trường không tồn tại, trả về thông báo lỗi
    // return res.status(400).send('Title and body are required.');
    res.send('Title and body are required.');
  }

  const mailOptions = {
      from: 'htluc3012@gmail.com',
      to: 'luchuynhtanct@gmail.com', // Địa chỉ email của admin
      subject: 'New Contact Form Submission',
      text: `Title: ${title}\nBody: ${body}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error(error);
          res.send('Error sending email');
      } else {
          console.log('Email sent: ' + info.response);
          res.send('Email sent successfully');
      }
  });
});

/* POST
    admin - register
*/

router.get("/register", (req, res) => {
  const locals = {
    title: "Register",
    description: "Register for a new account",
  };
  res.render("admin/register", { 
    locals,
  });
});

router.post("/register", async (req, res) => {
  try {
    const { username, password, rePassword } = req.body;

    // Kiểm tra xem các trường dữ liệu có tồn tại không
    if (!username || !password || !rePassword) {
      // return res.status(400).json({ message: "Username, password, and re-password are required" });
      res.send('Username, password, and re-password are required');
    }

    // Kiểm tra độ dài của mật khẩu
    if (password.length < 6) {
      // return res.status(400).json({ message: "Password must be at least 6 characters long" });
      res.send('Password must be at least 6 characters long');
    }

    // Kiểm tra mật khẩu và re-password có khớp nhau không
    if (password !== rePassword) {
      // return res.status(400).json({ message: "Password and re-password do not match" });
      res.send('Password and re-password do not match');

    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ username, password: hashedPassword });
      // res.status(201).json({ message: "User created", user });
      res.render("admin/login")
    } catch (error) {
      if (error.code === 11000) {
        // res.status(409).json({ message: "User already in use" });
      res.send('User already in use');
      }
      // res.status(409).json({ message: "User already in use" });
      res.send('User already in use');
    }
  } catch (error) {
    console.log(error);
  }
});

/**
 *
 * Check Login
 */
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

/* POST
    admin - check login
*/
router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ message: "User is not survival!" });
    }
    const ispassvalid = await bcrypt.compare(password, user.password);
    if (!ispassvalid) {
      res.status(401).json({ message: "Wrong password!" });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

/* GET
    admin - dashboard
*/
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Dashboard",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    const data = await Post.find();
    res.render("admin/dashboard", {
      locals,
      data,
      layout: adminlayout,
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET /
 * Admin - Create New Post
 */
router.get("/add-post", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Add Post",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    const data = await Post.find();
    res.render("admin/add-post", {
      locals,
      layout: adminlayout,
    });
  } catch (error) {
    console.log(error);
  }
});


/**
 * POST /
 * Admin - Create New Post
 */

router.post("/add-post", authMiddleware, upload.single('imageURL'), async (req, res) => {
  try {
    const newPost = new Post({
      title: req.body.title,
      body: req.body.body,
      imageURL: req.file.filename // Lưu tên file hình ảnh vào trường imageURL trong Post
    });

    await Post.create(newPost);
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * GET /
 * Admin - update
 */
router.get("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Edit Post",
      description: "Free NodeJs User Management System",
    };

    const data = await Post.findOne({ _id: req.params.id });

    res.render("admin/edit-post", {
      locals,
      data,
      layout: adminlayout,
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST /
 * Admin - update
 */

router.post("/edit-post/:id", authMiddleware, upload.single('imageURL'), async (req, res) => {
  try {
    const postId = req.params.id;
    const updatedPostData = {
      title: req.body.title,
      body: req.body.body,
    };

    // Kiểm tra xem có file hình ảnh được tải lên hay không
    if (req.file) {
      updatedPostData.imageURL = req.file.filename; // Lưu tên file hình ảnh vào trường imageURL trong Post
    }

    // Cập nhật bài viết
    await Post.findByIdAndUpdate(postId, { $set: updatedPostData, updatedAt: Date.now() });

    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * DELETE /
 * Admin - Delete Post
 */
router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET /
 * Admin Logout
 */
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  //res.json({ message: 'Logout successful.'});
  res.redirect("/");
});

module.exports = router;