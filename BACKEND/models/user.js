const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    required: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: true,
  },

  email: {
    type: String,
    trim: true,
    required: true,
    unique: [true, "duplicate email id"],
    minLength: 8,
  },
  password: {
    type: String,
    required: true,
  },

  mobile: {
    type: Number,
    required: true,
    unique: [true, "duplicate phone number"],
  },

  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Transgender"],
  },

  dateofbirth: {
    type: String,
    required: true,
  },

  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (newPassword) {
  const result = await bcrypt.compare(newPassword, this.password);
  return result;
};

module.exports = mongoose.model("User", userSchema);
