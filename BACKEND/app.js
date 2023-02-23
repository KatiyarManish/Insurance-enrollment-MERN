const express = require("express");

require("./DB/dbConnect");
const app = express();
const port = 5000;

const userRouter = require("./routes/auth");
app.use(express.json());
app.use("/api/v1/user", userRouter);

app.listen(port, () => {
  console.log(`app listening on this ${port}`);
});
