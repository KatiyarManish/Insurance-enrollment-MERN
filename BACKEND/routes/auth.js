const express = require("express");
const router = express.Router();
const { userValidator, validate } = require("../middleware/validator");

const {
  getUsers,
  createUser,
  verifyEmail,
  resendToken,
} = require("../controllers/auth");

router.get("/", getUsers);
router.post("/register", userValidator, validate, createUser);
router.post("/verify-email", verifyEmail);
router.post("/resend-token", resendToken);

module.exports = router;
