const User = require("../models/user");
const EmailVerification = require("../models/emailVerification");
const nodemailer = require("nodemailer");
const { isValidObjectId } = require("mongoose");

const getUsers = (req, res) => {
  res.send("welcome to backend with MVC + nodemon");
};

const createUser = async (req, res) => {
  const { firstName, lastName, email, password, mobile, gender, dateofbirth } =
    req.body;
  const userEmailExist = await User.findOne({ email });
  const userPhoneExist = await User.findOne({ mobile });
  if (userEmailExist) {
    return res.status(401).json({ error: "email already exist" });
  } else if (userPhoneExist) {
    return res.status(401).json({ error: "phone number already exist" });
  } else {
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      mobile,
      gender,
      dateofbirth,
    });

    // generate 6 digit OTP

    let OTP = "";
    for (let i = 0; i <= 5; i++) {
      let num = Math.round(Math.random() * 9);
      OTP = OTP + num;
    }
    // Store in DB
    const userOTP = await EmailVerification.create({
      owner: user._id,
      token: OTP,
    });

    // Send email to user

    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "b4d12ab9bfb177",
        pass: "953d7f7ad24758",
      },
    });

    transport.sendMail({
      from: "noreply@gmail.com",
      to: user.email,
      subject: "OTP from MERN",
      html: `your OTP is ${OTP}`,
    });

    res
      .status(201)
      .json({ msg: "email sent to your registered emailId with OTP" });
  }
};

const verifyEmail = async (req, res) => {
  const { userId, OTP } = req.body;
  if (!isValidObjectId(userId)) {
    return res.json({ error: "Invalid user" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.json({ error: "User not found" });
  }

  if (user.isVerified) {
    return res.json({ error: "user is already verified" });
  }

  const token = await EmailVerification.findOne({ owner: userId });
  if (!token) {
    return res.json({ error: "token not found" });
  }

  const isMatched = await token.compareToken(OTP);
  if (!isMatched) {
    return res.json({ error: "Please submit a valid token" });
  }

  user.isVerified = true;
  await user.save();

  await EmailVerification.findByIdAndDelete(token._id);

  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "b4d12ab9bfb177",
      pass: "953d7f7ad24758",
    },
  });

  transport.sendMail({
    from: "noreply@gmail.com",
    to: user.email,
    subject: "Welcome Email",
    html: `Welcome to our app.`,
  });

  res.json({ message: "your email is verified" });
};

const resendToken = async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    return res.json({ error: "user not found" });
  }

  if (user.isVerified) {
    return res.json({ error: "user is already verified" });
  }

  const newToken = await EmailVerification.findOne({ owner: userId });
  if (newToken) {
    return res.json({ error: "you can only send token after 1 hour" });
  }

  // generate 6 digit OTP

  let OTP = "";
  for (let i = 0; i <= 5; i++) {
    let num = Math.round(Math.random() * 9);
    OTP = OTP + num;
  }
  // Store in DB
  const userOTP = await EmailVerification.create({
    owner: user._id,
    token: OTP,
  });

  // Send email to user

  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "b4d12ab9bfb177",
      pass: "953d7f7ad24758",
    },
  });

  transport.sendMail({
    from: "noreply@gmail.com",
    to: user.email,
    subject: "OTP from MERN",
    html: `your OTP is ${OTP}`,
  });

  res
    .status(201)
    .json({ msg: "email sent to your registered emailId with new OTP" });
};

module.exports = { getUsers, createUser, verifyEmail, resendToken };
