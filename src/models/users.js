const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    require: true,
  },

  lastName: {
    type: String,
    require: true,
  },

  document: {
    type: String,
    require: true,
    unique: true,
  },

  email: {
    type: String,
    require: true,
    unique: true,
  },

  balance: {
    type: BigInt,
    require: true,
  },

  type: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Users", userSchema);
