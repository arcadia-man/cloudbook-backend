const mongoose = require("mongoose");

const connectToMongoose = () => {
  mongoose.connect(process.env.MONGO_URI, (e) => {
    console.log("db connected" + e);
  });
};
module.exports = connectToMongoose;
