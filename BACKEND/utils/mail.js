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
      user: "b4d12ab9bfb177",
      pass: "953d7f7ad24758",
    },
  });

module.exports = { sendOTP, emailTransport };
