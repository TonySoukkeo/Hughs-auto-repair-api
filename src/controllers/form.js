const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");

// Sendgrid config
const options = {
  auth: {
    api_user: process.env.SENDGRID_USER,
    api_key: process.env.SENDGRID_KEY
  }
};

const client = nodemailer.createTransport(sgTransport(options));

// Helper functions
const { setError } = require("../util/errorHandling");

module.exports.postQuestion = async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;

    // Check to see if any fields are empty
    if (!name || !email || !message) {
      setError(422, "All fields must be filled out");
    }

    // Send email out
    client.sendMail({
      to: process.env.SENDGRID_EMAIL,
      from: email,
      subject: "User question / feedback",
      html: `
        <h2>From ${name}</h2>
        <h2>${email}</h2>

        <br />

        <div style="white-space:pre-wrap">
        ${message}
        </div>
      `
    });

    res.status(200).json({ status: 200 });
  } catch (err) {
    next(err);
  }
};

module.exports.postQuote = async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const vehicle = req.body.vehicle;
    const description = req.body.description;

    // Check for any empty fields
    if (!name || !email || !vehicle || !description) {
      setError(422, "Please fill out all fields");
    }

    // Send email
    client.sendMail({
      to: process.env.SENDGRID_EMAIL,
      from: email,
      subject: "Quote request",
      html: `
        <h1>Quote request from ${name}</h1>

        <h3>Email: ${email}</h3>

        <br /> 
      
        <h3>Description of issue:</h3>
        <br />

        <div style="white-space:pre-wrap">
        ${description}
        </div>
      `
    });

    res.status(200).json({ status: 200 });
  } catch (err) {
    next(err);
  }
};
