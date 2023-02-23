const User = require("../models/user");
const EmailVerification = require("../models/emailVerification");
const passwordResetToken = require("../models/passwordResetToken");
const nodemailer = require("nodemailer");
const { isValidObjectId } = require("mongoose");
const { sendOTP, emailTransport } = require("../utils/mail");
const sendError = require("../utils/error");
const isValidPassword = require("../middleware/user");
const generateRandomByte = require("../utils/helper");
const jwt = require("jsonwebtoken");

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

    let OTP = sendOTP();
    // Store in DB
    const userOTP = await EmailVerification.create({
      owner: user._id,
      token: OTP,
    });

    // Send email to user

    var transport = emailTransport();

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

  var transport = emailTransport();

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
  if (user === null) {
    return sendError(res, "user not found...");
  }

  if (user.isVerified) {
    return res.json({ error: "user is already verified" });
  }

  const newToken = await EmailVerification.findOne({ owner: userId });
  if (newToken) {
    return res.json({ error: "you can only send token after 1 hour" });
  }

  // generate 6 digit OTP

  let OTP = sendOTP();
  // Store in DB
  const userOTP = await EmailVerification.create({
    owner: user._id,
    token: OTP,
  });

  // Send email to user

  var transport = emailTransport();

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

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return sendError(res, "user not found");
  }

  const newToken = await passwordResetToken.findOne({ owner: user._id });
  if (newToken) {
    return res.json({
      error: "token already available. Please try after 1 hour",
    });
  }

  // generate token
  const passwordToken = await generateRandomByte();

  // Store in DB
  await passwordResetToken.create({
    owner: user._id,
    token: passwordToken,
  });

  // Send email to user
  const url = `http://localhost:3000/reset-password/?token=${passwordToken}&id=${user._id}`;

  var transport = emailTransport();

  transport.sendMail({
    from: "noreply@gmail.com",
    to: user.email,
    subject: "reset Password",
    html: `your reset password link is given below
          <a href = ${url}>Click Here </a>
    `,
  });

  res
    .status(201)
    .json({ msg: "reset password email has been sent succesfully" });
};

const verifyResetPassword = (req, res) => {
  return res.json({ valid: true });
};

const generateNewPassword = async (req, res) => {
  const { newPassword, userId } = req.body;
  const user = await User.findById(userId);
  const matched = await user.comparePassword(newPassword);
  if (matched)
    return sendError(res, "new password must be different from old one");

  user.password = newPassword;
  await user.save();

  await passwordResetToken.findByIdAndDelete(req.tokenFromDB._id);

  var transport = emailTransport();
  transport.sendMail({
    from: "noreply@gmail.com",
    to: user.email,
    subject: "Password Reset Successfully",
    html: `You have setup new password successfully`,
  });

  res.json({
    message: "password reset successfully, you can login using new password",
  });
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return sendError(res, "either email or password is missing");
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    return sendError(res, "User not found");
  }

  const matched = await user.comparePassword(password);
  if (!matched) {
    return sendError(res, "password not matching");
  }

  const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

  res.json({
    user: { id: user._id, name: user.name, email: user.email, token: jwtToken },
  });
};

module.exports = {
  getUsers,
  createUser,
  verifyEmail,
  resendToken,
  forgotPassword,
  verifyResetPassword,
  generateNewPassword,
  signIn,
};
