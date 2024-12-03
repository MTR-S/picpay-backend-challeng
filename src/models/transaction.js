const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  amount: {
    type: BigInt,
    require: true,
  },

  payer: {
    type: mongoose.ObjectId,
    require: true,
  },

  payee: {
    type: mongoose.ObjectId,
    require: true,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
