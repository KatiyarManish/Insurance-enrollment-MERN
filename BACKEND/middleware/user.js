const { isValidObjectId } = require("mongoose");
const passwordResetToken = require("../models/passwordResetToken");
const sendError = require("../utils/error");

const isValidPassword = async (req, res, next) => {
  const { token, userId } = req.body;
  if (!token || !isValidObjectId(userId)) {
    return sendError(res, "invalid request or token or userId not available");
  }

  const tokenFromDB = await passwordResetToken.findOne({ owner: userId });
  if (!tokenFromDB) {
    return sendError(res, "unauthorized or User not found");
  }

  const matched = await tokenFromDB.compareToken(token);

  if (!matched) return sendError(res, "unauthorized or User not matched");
  req.tokenFromDB = tokenFromDB;
  next();
};

module.exports = isValidPassword;
