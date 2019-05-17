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
      date: {
        type: Number,
        default: Date.now() + (60 * 30 * 1000)//30 mins
      }
    }
  ]
});

// mongoose.model("Follows", Follows);
module.exports = User = mongoose.model("Follows", Follows);
