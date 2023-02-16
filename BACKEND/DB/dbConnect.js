const mongoose = require("mongoose");
require("dotenv").config();
async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to DB");
  } catch (error) {
    console.log("there is some error in DB connection");
  }
}

mongoose.set("strictQuery", false);

main();
