const mongoose = require("mongoose");

const BlogSchema = mongoose.Schema({
  title: {
    required: true,
    type: String
  },
  author: {
    required: true,
    type: mongoose.Types.ObjectId,
    ref: "User"
  },
  postedDate: {
    required: true,
    type: Date,
    default: new Date()
  },
  edited: {
    date: {
      type: Date
    },
    by: {
      type: mongoose.Types.ObjectId
    }
  },
  body: {
    required: true,
    type: String
  }
});

module.exports = mongoose.model("Blog", BlogSchema);
