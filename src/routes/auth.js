const express = require("express");
const router = express.Router();

// Auth controllers
const authControllers = require("../controllers/auth");

router.get("/check", authControllers.checkUser);

module.exports = router;
