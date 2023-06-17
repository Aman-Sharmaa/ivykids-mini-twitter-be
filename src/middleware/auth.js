const jwt = require("jsonwebtoken");
require("dotenv").config();
const reg = require("../model/register");
const JWT_SECRET = process.env.JWT_SECRET;

async function auth(req, res, next) {
  let token = req.headers.authorization;
  try {
    if (!token) {
      res.status(401);
      return res.json({ status: "401", message: "Access token not provided" });
    } else {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded.user;

      const existingUser = await reg.findOne({ email: req.user.email });
      if (existingUser.email === req.user.email) {
        next();
      } else {
        return res.json({ status: "500", message: "Invalid Token" });
      }
    }
  } catch (error) {
    return res.json({ status: "500", message: "Invalid Token" });
  }
}

module.exports = { auth };
