require("dotenv").config();

const express = require("express");
const app = express();
const PORT = 5000 || process.env.PORT;

const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");

app.use(express.urlencoded({ extended: true }));

//connect to mongodb
const expressLayout = require("express-ejs-layouts");
const session = require("express-session");

app.use(cookieParser());
const mongourl = "mongodb://127.0.0.1:27017/blognodejs";
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: mongourl,
    }),
  })
);

// const flash = require('connect-flash');
// const toastr = require('express-toastr');

// app.use(flash());
// app.use(toastr());

app.use(express.static("public"));
app.use(methodOverride("_method"));

app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", require("./server/routes/main"));
app.use("/", require("./server/routes/admin"));

// app.use(function (req, res, next)
// {
//     res.locals.toasts = req.toastr.render()
//     next()
// });

app.listen(PORT, () => {
  console.log(`App listening on port http://localhost:${PORT}`);
});
