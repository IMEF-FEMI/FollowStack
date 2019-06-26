const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const NotificationsSchema = new Schema({
  user_id: String,
  unread_count: {
    type: Number,
    default: 0
  },
  notifications: [
    {
      _id: { type: Schema.Types.ObjectId },
      title: String,
      when: {
        type: Number,
        default: Date.now()
      },
      type: String,
      to: String
    }
  ]
});

module.exports = Notifications = mongoose.model(
  "Notifications",
  NotificationsSchema
);
