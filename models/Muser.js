const mongoose = require("mongoose");

const Muser = mongoose.model(
  "Muser",
  new mongoose.Schema({
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    date: {
      type: Date,
      require: true,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Pending", "Active"],
      default: "Pending",
    },
    confirmationCode: {
      type: String,
    },
  })
);

module.exports = Muser;
