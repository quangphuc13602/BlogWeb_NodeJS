const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const PostSchema = new Schema({
  id_user: {
    type: String,
    required: true,
  },
  author_name: {
    type: String,
    required: true,
  },
  post_amount: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Author", PostSchema);
