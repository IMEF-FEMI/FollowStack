const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: true
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
    default: 50
  },
  joined: {
    type: Number,
    default: Date.now()
  },
  followers_gained: {
    type: Number,
    default: 0
  }
});

module.exports = User = mongoose.model("User", UserSchema);
