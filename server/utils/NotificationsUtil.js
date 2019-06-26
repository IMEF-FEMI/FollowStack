import Notifications from "../models/Notifications";
const { modelPatch } = require("./modelUtil");

const addNotification = async (user_id, newNotif) => {
  await Notifications.findOneAndUpdate(
    { user_id: user_id },
    {
      $addToSet: { notifications: newNotif },
      $inc: {
        unread_count: +1
      }
    },
    { new: true }
  ).then(notification => {
    if (!notification) {
      // if user doesnt have notifications model setup
      modelPatch("NOTIFICATIONS", { user_id: user_id }, () => {
        Notifications.findOneAndUpdate(
          { user_id: user_id },
          { $addToSet: { notifications: newNotif } },
          { new: true }
        );
      });
    }
  });
};

const markAsRead = user_id => {
  Notifications.findOneAndUpdate(
    { user_id: user_id },
    {
      $set: {
        unread_count: 0
      }
    },
    { new: true }
  );
};

const clear = user_id => {
  Notifications.findOneAndUpdate(
    { user_id: user_id },
    {
      $set: {
        unread_count: 0,
        notifications: []
      }
    },
    { new: true }
  );
};

module.exports = { addNotification, markAsRead, clear };
