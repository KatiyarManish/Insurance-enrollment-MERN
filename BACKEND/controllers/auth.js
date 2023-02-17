const User = require("../models/user");

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
    res.status(201).json({ user: user });
  }
};

module.exports = { getUsers, createUser };
