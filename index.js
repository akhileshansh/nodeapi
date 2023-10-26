const express = require("express");

const app = express();
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/ECOM");

const user_route = require("./routes/userRoute");
app.use("/api", user_route);
app.listen(3000, () => {
  console.log("Server run port 3000");
});
