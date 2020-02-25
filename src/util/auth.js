const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    // Check for 'Authorization' header
    const header = req.get("Authorization");

    if (!header) {
      req.isAuth = false;
      return next();
    }

    // Extract token from header
    const token = header.split(" ")[1];

    // Verify token
    const verifyToken = await jwt.verify(token, process.env.JWT_SECRET);

    if (!verifyToken) {
      req.isAuth = false;

      return next();
    }

    // Set userId and isAuth
    req.isAuth = true;
    req.userId = verifyToken.userId;

    next();
  } catch (err) {
    next(err);
  }
};
