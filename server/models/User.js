const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  screen_name: {
    type: String
  },
  photo: {
    type: String
  },
  userid: {
    type: String,
    required: true
  },
  location: {
    type: String
  },
  points: {
    type: Number,
    default: 100
  },
  joined: {
    type: Number,
    default: Date.now()
  },
  token_expired: {
    type: Boolean,
    default: false
  },
  socketId: {
    type: String,
    default: 0
  },
  accessToken: {
    type: String,
    default: 0
  },
  secret: {
    type: String,
    default: 0
  },
  keyInUse: {
    type: Number,
    default: 0
  }
});
module.exports = User = mongoose.model("User", UserSchema);
