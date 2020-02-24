const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

// Routes
const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");

// Auth
const auth = require("./util/auth");

// Initialize dotenv
dotenv.config();

const app = express();

// Parse application/json
app.use(bodyParser.json());

// Set headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, , X-Requested-With, Origin, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );

  res.statusCode = 200;

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Authentification check
app.use(auth);

// Routes
app.use("/user", userRoutes);

app.use("/blog", blogRoutes);

// Error handling
app.use((err, req, res, next) => {
  const status = err.statusCode || 400,
    message = err.message;

  res.status(status).json({ message, status });
});

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(process.env.PORT || 3000);
  console.log("connected");
});
