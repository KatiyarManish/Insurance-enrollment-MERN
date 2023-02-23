const express = require("express");
const router = express.Router();
const {
  userValidator,
  newPasswordValidate,
  validate,
  newPasswordValidator,
  signInValidator,
} = require("../middleware/validator");

const {
  getUsers,
  createUser,
  verifyEmail,
  resendToken,
  forgotPassword,
  verifyResetPassword,
  generateNewPassword,
  signIn,
} = require("../controllers/auth");
const isValidPassword = require("../middleware/user");

router.get("/", getUsers);
router.post("/register", userValidator, validate, createUser);
router.post("/verify-email", verifyEmail);
router.post("/resend-token", resendToken);
router.post("/reset-password", forgotPassword);
router.post("/verify-reset-password", isValidPassword, verifyResetPassword);
router.post(
  "/generate-new-password",
  isValidPassword,
  newPasswordValidator,
  validate,
  generateNewPassword
);
router.post("/sign-in", signInValidator, validate, signIn);

module.exports = router;
