const express = require("express");
const router = express.Router();

// Controllers
const userControllers = require("../controllers/user");

// Register user
router.post("/register", userControllers.postRegisterUser);

// Login user
router.post("/login", userControllers.postUserLogin);

// Change password
router.post("/password-reset", userControllers.postChangePassword);

module.exports = router;
