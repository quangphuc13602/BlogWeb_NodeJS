const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    mongoose.connect("mongodb://127.0.0.1:27017/blognodejs", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("database connected successfully!");
  } catch (error) {
    console.log("ERROR IS: ", error);
  }
};
module.exports = connectDB;
