const crypto = require("crypto");

const generateRandomByte = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(30, (err, buff) => {
      if (err) reject(err);
      const bufferString = buff.toString("hex");
      resolve(bufferString);
    });
  });
};

module.exports = generateRandomByte;
