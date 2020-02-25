const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");

// Initialize dotenv
dotenv.config();

// Routes
const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");
const galleryRoutes = require("./routes/gallery");

// Auth
const auth = require("./util/auth");

const app = express();

// Authentification check
app.use(auth);

// Configure multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    if (req.isAuth) {
      const uploadsDir = path.join(__dirname, "..", "public", "uploads");

      cb(null, uploadsDir);
    }
  },
  filename: function(req, file, cb) {
    if (req.isAuth) {
      const date = new Date();
      cb(null, `${date.toISOString()}-${file.originalname}`);
    }
  }
});

// Configure filter
const fileFilter = (req, file, cb, next) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "img/jpg" ||
    file.mimetype === "img/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(multer({ storage, fileFilter }).single("img"));

// Serve static files
app.use(express.static(path.join(__dirname, "..", "public")));

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

app.use("/gallery", galleryRoutes);

app.use("/user", userRoutes);

app.use("/blog", blogRoutes);

// Error handling
app.use((err, req, res, next) => {
  const status = err.statusCode || 400,
    message = err.message;

  res.status(status).json({ message, status, field: err.field });
});

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(process.env.PORT || 3000);
  console.log("connected");
});
