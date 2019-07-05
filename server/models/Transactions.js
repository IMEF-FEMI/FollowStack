const mongoose = require("mongoose");
const { Schema } = mongoose;


const TransactionSchema = new Schema({
  user_id: String,
  transactions: [
    {
      orderID: { type: String},
      amount: String,
      points: String,
      date: {
        type: Number,
        default: Date.now()
      },
    }
  ]
});

module.exports = Transactions = mongoose.model(
  "Transactions",
  TransactionSchema
);
