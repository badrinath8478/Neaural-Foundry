const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: process.env.SERVICE,
  auth: {
    user: process.env.MY_MAIL,
    pass: process.env.MY_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = transporter;
