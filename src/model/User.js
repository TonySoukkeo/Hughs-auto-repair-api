const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  admin: {
    type: Boolean,
    required: true,
    default: true
  },
  email: {
    required: true,
    type: String
  },
  password: {
    required: true,
    type: String
  },
  blogPosts: [
    {
      blogId: {
        required: true,
        ref: "Blog",
        type: mongoose.Types.ObjectId
      }
    }
  ]
});

module.exports = mongoose.model("user", UserSchema);
