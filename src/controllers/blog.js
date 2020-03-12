// Models
const Blog = require("../model/Blog");
const User = require("../model/User");

// Helper functions
const { setError } = require("../util/errorHandling");

/**************
  Add post blog
 **************/
module.exports.postBlog = async (req, res, next) => {
  try {
    const isAuth = req.isAuth,
      userId = req.userId;

    const title = req.body.title,
      body = req.body.content;

    // Check auth
    if (!isAuth) {
      setError(422, "Not authorized");
    }

    // Check if user exists
    const user = await User.findOne({ _id: userId });

    if (!user) {
      setError(404, "Invalid user");
    }

    // Check if title and body isn't empty
    if (!title) {
      setError(422, "Title cannot be empty");
    }

    if (!body) {
      setError(422, "Body cannot be empty");
    }

    // Continue if there are no errors

    // Create new blog
    const blog = new Blog({
      title,
      body,
      author: user._id
    });

    // Save blog to database
    await blog.save();

    res.status(200).json({ message: "Blog added", id: blog._id, status: 200 });
  } catch (err) {
    next(err);
  }
};

/***************
  Edit post blog
 ***************/
module.exports.editBlogPost = async (req, res, next) => {
  try {
    const isAuth = req.isAuth,
      userId = req.userId;

    const title = req.body.title,
      body = req.body.content;

    const blogId = req.query.blogId;

    // Check auth
    if (!isAuth) {
      setError(422, "Not authorized");
    }

    // Check if user exists
    const user = await User.findOne({ _id: userId });

    if (!user) {
      setError(404, "Invalid user");
    }

    // Check if blog exists
    const blog = await Blog.findOne({ _id: blogId });

    if (!blog) {
      setError(404, "Blog post not found");
    }

    // Check if title and body isn't empty
    if (!title) {
      setError(422, "Title cannot be empty");
    }

    if (!body) {
      setError(422, "Body cannot be empty");
    }

    // Continue if there are no errors

    // Update blog
    await blog.update({
      title,
      body,
      author: blog.author,
      edited: {
        date: new Date(),
        by: user._id
      }
    });

    res.status(200).json({ message: "Succesfully updated", status: 200 });
  } catch (err) {
    next(err);
  }
};

/******************
  Delete blog post
 ******************/
module.exports.postDeleteBlogPost = async (req, res, next) => {
  try {
    const isAuth = req.isAuth,
      userId = req.userId;

    const blogId = req.query.blogId;

    // Check auth
    if (!isAuth) {
      setError(422, "Not authorized");
    }

    // Check if user exists
    const user = await User.findOne({ _id: userId });

    if (!user) {
      setError(404, "Invalid user");
    }

    // Check if blog exists
    const blog = await Blog.findOne({ _id: blogId });

    if (!blog) {
      setError(404, "Blog post not found");
    }

    // Continue if there are no errors

    // Delete blog post
    await Blog.deleteOne({ _id: blogId });

    res.status(201).json({ message: "Post deleted", status: 201 });
  } catch (err) {
    next(err);
  }
};

/*********
  Get blog
 *********/
module.exports.getBlogPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const LIMIT = parseInt(req.query.limit);
    console.log("made it in");
    const total_count = await Blog.find({}).count();

    const blog = await Blog.find({})
      .sort({ postedDate: -1 })
      .limit(LIMIT)
      .skip(page * LIMIT - LIMIT);

    let loadMore = true;

    if (LIMIT * page >= total_count) loadMore = false;
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ blog, loadMore, status: 200 });
  } catch (err) {
    next(err);
  }
};

/*********************
  Get single blog post
 *********************/
module.exports.getSingleBlogPost = async (req, res, next) => {
  try {
    const blogId = req.query.blogId;

    // Check if blog exists
    const blog = await Blog.findOne({ _id: blogId });

    if (!blog) {
      setError(404, "Blog post not found");
    }

    res.status(200).json({ status: 200, blog });
  } catch (err) {
    next(err);
  }
};
