const mongoose = require("mongoose");
//here i added inotebook to save my all thee data in inotebook collection

const pe =  
  "mongodb://iNotebook:iNotebook@cluster0-shard-00-00.0zeoj.mongodb.net:27017,cluster0-shard-00-01.0zeoj.mongodb.net:27017,cluster0-shard-00-02.0zeoj.mongodb.net:27017/iNotebook?ssl=true&replicaSet=atlas-7d9m1y-shard-0&authSource=admin&retryWrites=true&w=majority";
const connectToMongoose = () => {
  mongoose.connect( pe, (e) => {
    console.log("db connected"+e);
  });
};
module.exports = connectToMongoose;