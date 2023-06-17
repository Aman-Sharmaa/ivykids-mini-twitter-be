const express = require("express");
const router = new express.Router();
const userAuthIVY = require("../controllers/ivykids/auth");
const multer = require("multer");

router.post("/ivy/registration", userAuthIVY.ivyRegistration);
router.post("/ivy/login", userAuthIVY.loginUser);

module.exports = router;
