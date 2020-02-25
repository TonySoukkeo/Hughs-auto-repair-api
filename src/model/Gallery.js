const mongoose = require("mongoose");

const GallerySchema = mongoose.Schema({
  url: {
    required: true,
    type: String
  },
  datePosted: {
    required: true,
    type: Date
  }
});

module.exports = mongoose.model("gallery", GallerySchema);
