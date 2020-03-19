const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Models
const User = require("../model/User");

// Helper functions
const { setError } = require("../util/errorHandling");
/*******
 REGISTER
 ******/
module.exports.postRegisterUser = async (req, res, next) => {
  try {
    const firstName = req.body.firstName,
      lastName = req.body.lastName,
      email = req.body.email,
      password = req.body.password,
      confirmPassword = req.body.confirmPassword;

    // Check for any empty input fields
    if (!firstName || !lastName || !email || !password) {
      const error = new Error();
      error.status = 422;
      error.message = "Fields cannot be empty";
      throw error;
    }

    // Check if password and confirm password matches
    if (password !== confirmPassword) {
      const error = new Error();
      error.status = 422;
      error.message = "Passwords do not match";

      throw error;
    }

    // Hash password
    const hashedPw = await bcrypt.hash(password, 12);

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPw
    });

    // Save new user to database
    await user.save();

    res.status(200).json("User created");
  } catch (err) {
    next(err);
  }
};

/*********
 User login
**********/
module.exports.postUserLogin = async (req, res, next) => {
  try {
    const email = req.body.email,
      password = req.body.password;

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      setError(402, "Invalid email or password");
    }

    // Check if password is correct
    const matchedPw = await bcrypt.compare(password, user.password);

    if (!matchedPw) {
      setError(402, "Invalid email or password");
    }

    // Continue if there are no errors

    // Generate webtoken
    const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.status(200).json({ status: 200, token, user });
  } catch (err) {
    next(err);
  }
};

// Change password
module.exports.postChangePassword = async (req, res, next) => {
  try {
    const password = req.body.password;
    const oldPassword = req.body.oldPassword;

    const isAuth = req.isAuth;
    const userId = req.userId;

    // Check if user is authenticated
    if (!isAuth) {
      setError(402, "Not authorized");
    }

    // Check if user exists
    const user = await User.findOne({ _id: userId });

    if (!user) {
      setError(404, "User not found");
    }

    // Check if old password matches password from found user
    const validateOldPW = await bcrypt.compare(oldPassword, user.password);

    if (!validateOldPW) {
      setError(422, "Incorrect old password supplied");
    }

    // Check password length
    if (password.length < 10) {
      setError(422, "Password must be at least 10 characters long");
    }

    // Check if new password is unique from the old one
    const pwMatch = await bcrypt.compare(password, user.password);

    if (pwMatch) {
      setError(422, "Password cannot be the same as the old one");
    }

    // Hash new password
    const hashedPw = await bcrypt.hash(password, 12);

    // Update user password
    await user.update({ password: hashedPw });

    res
      .status(200)
      .json({ status: 200, message: "Password succesfully updated!" });
  } catch (err) {
    next(err);
  }
};
