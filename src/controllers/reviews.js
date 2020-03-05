// Models
const Review = require("../model/Review");

const getReviews = async (req, res, next) => {
  try {
    const limit = +req.query.limit;
    const page = +req.query.limit || 1;

    const total_count = await Review.find({}).countDocuments();

    const reviews = await Review.find({})
      .sort({ datePosted: -1 })
      .limit(limit)
      .skip(page * limit - limit);
    let loadMore = true;

    if (limit * page >= total_count) loadMore = false;

    res.status(200).json({ reviews, status: 200, loadMore });
  } catch (err) {
    next(err);
  }
};

module.exports = getReviews;
