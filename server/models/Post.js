const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostSchema = new Schema({
  _owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Number, default: Date.now()+ (10 * 60 * 1000) },
  post_id: String
});

module.exports = Post = mongoose.model("Post", PostSchema);
