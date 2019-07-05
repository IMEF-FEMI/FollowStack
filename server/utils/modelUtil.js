const Notifications = require("../models/Notifications");
const Transactions = require("../models/Transactions");

const modelPatch = (type, params, callback) => {
    console.log("trying to notify modelPatch")

  switch (type) {
    case "NOTIFICATIONS":
      new Notifications(params).save().then(notif=>{
      	console.log("Notifications model done")
      callback();
      	
      });
      break;
      case "TRANSACTIONS":
new Transactions(params).save().then(transact=>{
        console.log("Transaction model done")
      callback();
      });
  }
};

module.exports = { modelPatch };
