// const express = require("express");
// const router = express.Router();
// const Post = require("../models/Post");
// const User = require("../models/User");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const jwtSecret = process.env.JWT_SECRET;
// // const connectDB = require("../config/db");
// // connectDB();
// const adminlayout = "../views/layouts/admin";

// /* GET
// HOME 
// */
// router.get("/admin/login", async (req, res) => {
//   try {
//     const locals = {
//       title: "Blog website - admin",
//       description: "Blog website created with Nodejs, express, mongodb",
//     };
//     res.render("admin/login", {
//       locals,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// router.get("/admin/register", (req, res) => {
//   const locals = {
//     title: "Register",
//     description: "Register for a new account",
//   };
//   res.render("admin/register", { locals, layout: adminlayout });
// });

// /* POST
//     admin - register
// */

// router.post("/admin/register", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     // Kiểm tra xem các trường dữ liệu có tồn tại không
//     if (!username || !password) {
//       return res.status(400).json({ message: "Username and password are required" });
//     }
//     // Kiểm tra độ dài của mật khẩu
//     if (password.length < 6) {
//       return res.status(400).json({ message: "Password must be at least 6 characters long" });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     try {
//       const user = await User.create({ username, password: hashedPassword });
//       // res.status(201).json({ message: "User created", user });
//       res.render("admin/login")
//     } catch (error) {
//       if (error.code === 11000) {
//         res.status(409).json({ message: "User already in use" });
//       }
//       res.status(409).json({ message: "User already in use" });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

// /**
//  *
//  * Check Login
//  */
// const authMiddleware = (req, res, next) => {
//   const token = req.cookies.token;

//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   try {
//     const decoded = jwt.verify(token, jwtSecret);
//     req.userId = decoded.userId;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Unauthorized" });
//   }
// };

// /* POST
//     admin - check login
// */
// router.post("/admin/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });
//     if (!user) {
//       res.status(401).json({ message: "User is not survival!" });
//     }
//     const ispassvalid = await bcrypt.compare(password, user.password);
//     if (!ispassvalid) {
//       res.status(401).json({ message: "Wrong password!" });
//     }

//     const token = jwt.sign({ userId: user._id }, jwtSecret);
//     res.cookie("token", token, { httpOnly: true });
//     res.redirect("admin/dashboard");
//   } catch (error) {
//     console.log(error);
//   }
// });

// /* get
//     admin - dashboard
// */
// router.get("/admin/dashboard", authMiddleware, async (req, res) => {
//   try {
//     const locals = {
//       title: "Dashboard",
//       description: "Simple Blog created with NodeJs, Express & MongoDb.",
//     };

//     const data = await Post.find();
//     res.render("admin/dashboard", {
//       locals,
//       data,
//       layout: adminlayout,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// /**
//  * GET /
//  * Admin - Create New Post
//  */
// router.get("/admin/add-post", authMiddleware, async (req, res) => {
//   try {
//     const locals = {
//       title: "Add Post",
//       description: "Simple Blog created with NodeJs, Express & MongoDb.",
//     };

//     const data = await Post.find();
//     res.render("admin/add-post", {
//       locals,
//       layout: adminlayout,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// /**
//  * POST /
//  * Admin - Create New Post
//  */
// router.post("/admin/add-post", authMiddleware, async (req, res) => {
//   try {
//     try {
//       const newPost = new Post({
//         title: req.body.title,
//         body: req.body.body,
//       });

//       await Post.create(newPost);
//       res.redirect("/admin/dashboard");
//     } catch (error) {
//       console.log(error);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

// /**
//  * GET /
//  * Admin - update
//  */
// router.get("/admin/edit-post/:id", authMiddleware, async (req, res) => {
//   try {
//     const locals = {
//       title: "Edit Post",
//       description: "Free NodeJs User Management System",
//     };

//     const data = await Post.findOne({ _id: req.params.id });

//     res.render("admin/edit-post", {
//       locals,
//       data,
//       layout: adminlayout,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// /**
//  * PUT /
//  * Admin - update
//  */
// router.put("/admin/edit-post/:id", authMiddleware, async (req, res) => {
//   try {
//     await Post.findByIdAndUpdate(req.params.id, {
//       title: req.body.title,
//       body: req.body.body,
//       updatedAt: Date.now(),
//     });

//     res.redirect("/admin/dashboard");
//   } catch (error) {
//     console.log(error);
//   }
// });

// /**
//  * DELETE /
//  * Admin - Delete Post
//  */
// router.delete("/admin/delete-post/:id", authMiddleware, async (req, res) => {
//   try {
//     await Post.deleteOne({ _id: req.params.id });
//     res.redirect("/admin/dashboard");
//   } catch (error) {
//     console.log(error);
//   }
// });

// /**
//  * GET /
//  * Admin Logout
//  */
// router.get("/admin/logout", (req, res) => {
//   res.clearCookie("token");
//   //res.json({ message: 'Logout successful.'});
//   res.redirect("/");
// });

// module.exports = router;





const express = require("express");
const app = express();
const bodyparser = require('body-parser');
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
    const { username, password } = req.body;
    // Kiểm tra xem các trường dữ liệu có tồn tại không
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    // Kiểm tra độ dài của mật khẩu
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await User.create({ username, password: hashedPassword });
      // res.status(201).json({ message: "User created", user });
      res.render("admin/login")
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({ message: "User already in use" });
      }
      res.status(409).json({ message: "User already in use" });
    }
  } catch (error) {
    console.log(error);
  }
});

// router.post("/register", upload.single('imageURL'), async (req, res, next) => {
//   try {
//     const { username, password } = req.body;

//     // Kiểm tra xem các trường dữ liệu có tồn tại không
//     if (!username || !password) {
//       return res.status(400).json({ message: "Username and password are required" });
//     }

//     // Kiểm tra độ dài của mật khẩu
//     if (password.length < 6) {
//       return res.status(400).json({ message: "Password must be at least 6 characters long" });
//     }

//     // Kiểm tra nếu có file được tải lên
//     const file = req.file;
//     if (!file) {
//       return res.status(400).json({ message: "Please upload an image" });
//     }

//     // Hash mật khẩu
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Tạo người dùng mới với thông tin và đường dẫn hình ảnh
//     const user = await User.create({
//       username,
//       password: hashedPassword,
//       imageURL: file.filename // Lưu tên file hình ảnh vào trường imageURL trong User
//     });

//     // Chuyển hướng hoặc gửi phản hồi thành công
//     res.render("admin/login");
//   } catch (error) {
//     console.error(error);

//     // Xử lý lỗi
//     if (error.code === 11000) {
//       res.status(409).json({ message: "User already in use" });
//     } else {
//       next(error);
//     }
//   }
// });


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

/* get
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
// router.post("/add-post", authMiddleware, async (req, res) => {
//   try {
//     try {
//       const newPost = new Post({
//         title: req.body.title,
//         body: req.body.body,
//       });

//       await Post.create(newPost);
//       res.redirect("/dashboard");
//     } catch (error) {
//       console.log(error);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

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
 * PUT /
 * Admin - update
 */
// router.put("/edit-post/:id", authMiddleware, async (req, res) => {
//   try {
//     await Post.findByIdAndUpdate(req.params.id, {
//       title: req.body.title,
//       body: req.body.body,
//       updatedAt: Date.now(),
//     });

//     res.redirect("/dashboard");
//   } catch (error) {
//     console.log(error);
//   }
// });

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