const express = require("express");
const router = express.Router();
const {
  userValidator,
  newPasswordValidate,
  validate,
  newPasswordValidator,
} = require("../middleware/validator");

const {
  getUsers,
  createUser,
  verifyEmail,
  resendToken,
  forgotPassword,
  verifyResetPassword,
  generateNewPassword,
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

module.exports = router;
