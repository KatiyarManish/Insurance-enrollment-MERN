const express = require("express");
const router = express.Router();
const { userValidator, validate } = require("../middleware/validator");

const { getUsers, createUser, verifyEmail } = require("../controllers/auth");

router.get("/", getUsers);
router.post("/register", userValidator, validate, createUser);
router.post("/verify-email", verifyEmail);

module.exports = router;
