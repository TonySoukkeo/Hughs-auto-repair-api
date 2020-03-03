const express = require("express");
const router = express.Router();

// Controllers
const formControllers = require("../controllers/form");

router.post("/question", formControllers.postQuestion);

router.post("/quote", formControllers.postQuote);

module.exports = router;
