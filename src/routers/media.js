const fs = require("fs");
const express = require("express");
const router = new express.Router();
const path = require("path");
const { get } = require("http");

// Route to get the client's IP address and location

router.get("/media", (req, res) => {
  try {
    const filename = req.query.file;
    res.status(200).sendFile(path.join(__dirname, "../../upload", filename));
  } catch (e) {
    console.log(e);
  }
});

router.get("/avatars", (req, res) => {
  try {
    const filename = req.query.file;
    res.status(200).sendFile(path.join(__dirname, "../../avatars", filename));
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
