const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config();

// Models
const User = require("../model/User");
const Gallery = require("../model/Gallery");

// Helper functions
const { setError } = require("../util/errorHandling");

/*************
 Upload images
 *************/
module.exports.postUploadImage = async (req, res, next) => {
  try {
    const isAuth = req.isAuth;
    const userId = req.userId;

    // Check for auth
    if (!isAuth) {
      setError(402, "Not authorized");
    }

    // Check if user exists
    const user = await User.findOne({ _id: userId });

    if (!user) {
      setError(404, "Invalid user");
    }

    const remove = path.join(__dirname, "..", "..", "public");
    const relPath = req.file.path.replace(remove, "");

    // Check to see if relPath doesn't already exists in gallery db
    const gallery = await Gallery.findOne({ url: relPath });

    if (!gallery) {
      const date = new Date();

      // Create new photo entry
      const photoEntry = new Gallery({
        url: relPath,
        datePosted: date.toISOString()
      });

      await photoEntry.save();
    }

    res.status(200).json("Image uploaded");
  } catch (err) {
    next(err);
  }
};

/*************
 Delete images
 *************/
module.exports.deleteImage = async (req, res, next) => {
  try {
    const isAuth = req.isAuth;
    const userId = req.userId;

    const imageId = req.query.imageId;

    // Check for auth
    if (!isAuth) {
      setError(402, "Not authorized");
    }

    // Check if user exists
    const user = await User.findOne({ _id: userId });

    if (!user) {
      setError(404, "Invalid user");
    }

    // Check if image in gallery exists
    const gallery = await Gallery.findOne({ _id: imageId });

    if (!gallery) {
      setError(404, "Image not found");
    }

    // Continue if there are no errors

    // Get relative path of image
    const relPath = gallery.url.split("uploads/")[1];
    const imagePath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "uploads",
      relPath
    );

    // Remove image from file system
    fs.unlink(imagePath, err => {
      if (err) throw err;
    });

    // Remove image from Gallery collection in db
    await gallery.remove();

    res.status(200).json(relPath);
  } catch (err) {
    next(err);
  }
};

/***********************
 Get images from gallery
 ***********************/
module.exports.getGallery = async (req, res, next) => {
  try {
    const page = req.body.page || 1;

    const PER_PAGE = 12;

    const total_count = await Gallery.find({}).count();

    const gallery = await Gallery.find({})
      .limit(PER_PAGE)
      .skip(page * PER_PAGE - PER_PAGE);

    let loadMore = false;

    if (PER_PAGE * page >= total_count) loadMore = false;

    res.status(200).json({ gallery, loadMore, status: 200 });
  } catch (err) {
    next(err);
  }
};
