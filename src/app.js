require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const cors = require("cors");

const router = require("./routers/profile");
require("../src/db/conn");
const { auth } = require("./middleware/auth");
const { secure } = require("./middleware/secure");
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/auth", auth, require("./routers/profile"));
app.use("/secure", require("./routers/secure"));
app.use("/open", require("./routers/media"));

app.use("/avatars", express.static("./avatars"));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.listen(port, () => {
  console.log(`server is running at port no ${port}`);
});
