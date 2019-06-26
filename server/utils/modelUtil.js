import Notifications from "../models/Notifications";

const modelPatch = (type, params, callback) => {
  switch (type) {
    case "NOTIFICATIONS":
      new Notifications(params).save();
      callback();
      break;
  }
};

module.exports = { modelPatch };
