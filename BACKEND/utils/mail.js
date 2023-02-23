const nodemailer = require("nodemailer");

const sendOTP = (length = 6) => {
  let OTP = "";
  for (let i = 1; i <= length; i++) {
    let num = Math.round(Math.random() * 9);
    OTP = OTP + num;
  }
  return OTP;
};

const emailTransport = () =>
  nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAIL_TRAP_USER,
      pass: process.env.MAIL_TRAP_PASSWORD,
    },
  });

module.exports = { sendOTP, emailTransport };
