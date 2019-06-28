const Notifications = require("../models/Notifications");
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
          { $addToSet: { notifications: newNotif } ,
      $inc: {
        unread_count: +1
      }},
          { new: true }
        ).then(notification=>{
        if(notification){
          console.log("Notification added with new model")
        }
      }).catch(err=>{
    console.log("trying to notify error inner")

        console.log(err)
      });
      })
    }else{
      console.log("Notification added")
    }
  }).catch(err=>{
    console.log("trying to notify error outer")

    console.log(err)
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

const getNotifications = (user_id, callback)=>{
Notifications.findOne({ user_id: user_id }).then(notifications => {
      if (notifications) {
        callback(notifications)
      }}
      )
}

module.exports = { addNotification, markAsRead, clear , getNotifications};
