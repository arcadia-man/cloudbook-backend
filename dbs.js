const mongoose = require("mongoose");
//here i added inotebook to save my all thee data in inotebook collection
const mongoURI =
  "mongodb+srv://iNotebook:iNotebook@cluster0.0zeoj.mongodb.net/iNotebook?retryWrites=true&w=majority";
const connectToMongoose = () => {
  mongoose.connect(mongoURI, () => {
    console.log("connected to mongo db succsessfull.");
  });
};
module.exports = connectToMongoose;