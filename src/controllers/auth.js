const jwt = require("jsonwebtoken");

// Models
const User = require("../model/User");

// Helper functions
const { setError } = require("../util/errorHandling");

module.exports.checkUser = async (req, res, next) => {
  try {
    const userId = req.query.userId;
    const token = req.query.token;

    // Verify token
    const validToken = await jwt.verify(token, process.env.JWT_SECRET);

    if (!validToken) {
      setError(400, "Invalid token");
    }

    // Compare userId with userId from token
    if (validToken.userId !== userId) {
      setError(422, "Not Authorized");
    }

    // Check if user exists
    const user = await User.findOne({ _id: userId }, { password: 0 });

    if (!user) {
      setError(404, "User not found");
    }

    res.status(200).json({ status: 200, user });
  } catch (err) {
    next(err);
  }
};
