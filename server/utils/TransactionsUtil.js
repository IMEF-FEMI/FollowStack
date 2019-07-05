const Transactions = require("../models/Transactions");
const { modelPatch } = require("./modelUtil");

const addTransaction = async (user_id, newTransaction) => {
  await Transactions.findOne({
    user_id: user_id
  }).then(transactions => {
    if (!transactions) {
      modelPatch("TRANSACTIONS", { user_id: user_id }, () => {
        Transactions.findOneAndUpdate(
          {
            user_id: user_id
          },
          {
            $addToSet: { transactions: newTransaction }
          },
          { new: true }
        )
          .then(transactions => {
            if (transactions) {
              console.log("transactions added new");
            }
          })
          .catch(err => {
            console.log(err);
          });
      });
    } else {
      console.log("current Transactions object " + transactions);
      Transactions.findOneAndUpdate(
        {
          user_id: user_id
        },
        {
          $addToSet: { transactions: newTransaction }
        },
        { new: true }
      )
        .then(transactions => {
          if (transactions) {
            console.log("transactions added ");
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  });
};

module.exports = { addTransaction };