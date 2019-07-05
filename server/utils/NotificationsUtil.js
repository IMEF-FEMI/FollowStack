const Notifications = require("../models/Notifications");
const { modelPatch } = require("./modelUtil");

const addNotification = async (user_id, newNotif) => {
  await Notifications.findOne({
    user_id: user_id
  }).then(notification => {
    console.log(notification);
    if (!notification) {
      modelPatch("NOTIFICATIONS", { user_id: user_id }, () => {
        Notifications.findOneAndUpdate(
          {
            user_id: user_id
          },
          {
            $addToSet: { notifications: newNotif },
            $inc: {
              unread_count: +1
            }
          },
          { new: true }
        )
          .then(notification => {
            if (notification) {
              console.log("Notification added new");
            }
          })
          .catch(err => {
            console.log(err);
          });
      });
    } else {
      console.log("current notification object " + notification);
      Notifications.findOneAndUpdate(
        {
          user_id: user_id
        },
        {
          $addToSet: { notifications: newNotif },
          $inc: {
            unread_count: +1
          }
        },
        { new: true }
      )
        .then(notification => {
          if (notification) {
            console.log("Notification added old");
          }
        })
        .catch(err => {
          console.log(err);
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
  ).catch(err=>{
    console.log(err)
  });
};

const getNotifications = (user_id, callback) => {
  Notifications.findOne({
    user_id: user_id
  }).then(notifications => {
    if (notifications) {
      callback(notifications);
    }
  });
};


module.exports = { addNotification, markAsRead, clear, getNotifications };
