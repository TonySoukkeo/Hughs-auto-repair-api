const mongoose = require("mongoose");

const ReviewModel = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  datePosted: {
    type: Date,
    required: true
  },
  review: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("review", ReviewModel);
