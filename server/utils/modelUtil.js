const Notifications = require("../models/Notifications");

const modelPatch = (type, params, callback) => {
    console.log("trying to notify modelPatch")

  switch (type) {
    case "NOTIFICATIONS":
      new Notifications(params).save().then(notif=>{
      	console.log("Notifications model done")
      callback();
      	
      });
      break;
  }
};

module.exports = { modelPatch };
