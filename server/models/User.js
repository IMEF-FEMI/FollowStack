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
        default: 100
    },
    joined: {
        type: Number,
        default: Date.now()
    },
    likes_given: {
        type: Number,
        default: 0
    },
    comments_given: {
        type: Number,
        default: 0
    },
    retweets_given: {
        type: Number,
        default: 0
    },
    likes_gained: {
        type: Number,
        default: 0
    },
    comments_gained: {
        type: Number,
        default: 0
    },
    retweets_gained: {
        type: Number,
        default: 0
    }
});
module.exports = User = mongoose.model("User", UserSchema);