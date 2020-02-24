const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Initialize dotenv
dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(process.env.PORT || 3000);
  console.log("connected");
});
