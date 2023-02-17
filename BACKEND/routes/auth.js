const express = require("express");
const router = express.Router();
const { userValidator, validate } = require("../middleware/validator");

const { getUsers, createUser } = require("../controllers/auth");

router.get("/", getUsers);
router.post("/register", userValidator, validate, createUser);

module.exports = router;
