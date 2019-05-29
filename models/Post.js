const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostSchema = new Schema({
  _owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Number, default: Date.now() },
  text: String,
  post_id: String,
  name: String,
  screen_name: String,
  photo: String
});

module.exports = Post = mongoose.model("Post", PostSchema);
