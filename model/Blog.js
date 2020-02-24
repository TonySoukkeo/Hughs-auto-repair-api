const mongoose = require("mongoose");
const Schema = mongoose.Schema();

const BlogSchema = Schema({
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
  edited: Date,
  body: {
    required: true,
    type: String
  }
});

module.exports = mongoose.model("Blog", BlogSchema);
