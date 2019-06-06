const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const Follows = new Schema({
  username: String,
  user_id: String,
  following: [
    {
      user_id: String,
      name: String,
      screen_name: String,
      photo: String,
      following: {
        type: Boolean,
        default: false
      },
      date: {
        type: Number,
        default: Date.now() + 70 * 60 * 1000 //1hr plus
      }
    }
  ]
});

module.exports = User = mongoose.model("UsersOnline", Follows);
