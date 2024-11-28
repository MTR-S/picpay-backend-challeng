const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  amount: {
    type: BigInt,
    require: true,
  },

  payer: {
    type: Number,
    require: true,
  },

  payee: {
    type: Number,
    require: true,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
