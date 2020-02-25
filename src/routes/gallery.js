const express = require("express");
const router = express.Router();

// Controllers
const galleryControllers = require("../controllers/gallery");

router.get("/images", galleryControllers.getGallery);

router.post("/upload", galleryControllers.postUploadImage);

router.delete("/upload", galleryControllers.deleteImage);

module.exports = router;
