const express = require("express");
const router = express.Router();

// Controllers
const blogControllers = require("../controllers/blog");

// Get single blog post
router.get("/post", blogControllers.getSingleBlogPost);

// Get blog posts
router.get("/posts", blogControllers.getBlogPosts);

// Post to blog
router.post("/posts", blogControllers.postBlog);

// Edit blog
router.patch("/posts", blogControllers.editBlogPost);

// Delete blog
router.delete("/posts", blogControllers.postDeleteBlogPost);

module.exports = router;
