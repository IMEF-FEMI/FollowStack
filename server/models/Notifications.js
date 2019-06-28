const mongoose = require("mongoose");
const { Schema } = mongoose;


const NotificationsSchema = new Schema({
  user_id: String,
  unread_count: {
    type: Number,
    default: 0
  },
  notifications: [
    {
      _id: { type: Schema.Types.ObjectId, default: new mongoose.Types.ObjectId() },
      title: String,
      when: {
        type: Number,
        default: Date.now()
      },
      notificationType: String,
      to: { type: String, default: "#" }
    }
  ]
});

module.exports = Notifications = mongoose.model(
  "Notifications",
  NotificationsSchema
);
