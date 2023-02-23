const { check, validationResult } = require("express-validator");
const user = require("../models/user");

const userValidator = [
  check("firstName").trim().notEmpty().withMessage("first Name is missing"),
  check("lastName").trim().notEmpty().withMessage("Last Name is missing"),
  check("email").isEmail().withMessage("Email is missing or invalid email"),
  check("password").trim().notEmpty().withMessage("Password is missing"),
  check("mobile")
    .trim()
    .notEmpty()
    .withMessage("Mobile number is missing")
    .isLength({ min: 10 })
    .withMessage("password should be minimum of 10")
    .isLength({ max: 13 })
    .withMessage("password should be maximum of 13")
    .isNumeric()
    .withMessage("mobile number should be a valid number "),
  check("gender").trim().notEmpty().withMessage("Gender is missing"),
  check("dateofbirth")
    .trim()
    .notEmpty()
    .withMessage("date of birth is missing"),
];

const newPasswordValidator = [
  check("newPassword").trim().notEmpty().withMessage("Password is missing"),
];

const validate = (req, res, next) => {
  const error = validationResult(req).array();
  if (error.length) {
    console.log(error);
    return res.json({ error: error[0].msg });
  }
  next();
};

module.exports = { userValidator, newPasswordValidator, validate };
