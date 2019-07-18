const Transactions = require("../models/Transactions");

const modelPatch = (type, params, callback) => {
    console.log("trying to notify modelPatch")

  switch (type) {
    
      case "TRANSACTIONS":
    new Transactions(params).save().then(transact=>{
        console.log("Transaction model done")
      callback();
      });
      break;
  }
};

module.exports = { modelPatch };
