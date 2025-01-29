const { o2switch } = require("./dot-env");
const nodemailer = require('nodemailer');

exports.transporter = nodemailer.createTransport({
  host: "gavin.o2switch.net",
  port: 465,
  secure: true,
  auth: {
    user: o2switch.router,
    pass: o2switch.password,
  }
});