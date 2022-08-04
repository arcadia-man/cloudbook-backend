const connectToMongo = require("./dbs");
const express = require("express");
var cors = require("cors");
//we are connecting the database by using function call
connectToMongo();
//creating express app using express function
const app = express();
//assigning the port value
const port = 5000;
//to get the request value
app.use(express.json());
app.use(cors());

//avilabel routers
app.use("/api/mauth", require("./routes/mauth"));
app.use("/api/notes", require("./routes/notes"));
//finally listening the backend on the port
app.listen(port, () => {
  console.log("port is listening at 5000");
});
