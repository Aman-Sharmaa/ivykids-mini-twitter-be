const express = require("express");
const router = new express.Router();
const path = require("path");
const { get } = require("http");
const ivyPost = require("../controllers/ivykids/ugc");
const ivyHomefeed = require("../controllers/ivykids/homefeed");
const ivyConnection = require("../controllers/ivykids/connection");

const multer = require("multer");

// Route to get the client's IP address and location

router.use(express.static(__dirname + "../../upload"));
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./upload");
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
const multiFile = upload.fields([{ name: "postImage", maxCount: 4 }]);

//media file

router.get("/media", (req, res, next) => {
  try {
    const filename = req.query.file;
    res.status(200).sendFile(path.join(__dirname, "../../upload", filename));
  } catch (e) {
    console.log(e);
  }
});

//ivykids db
router.get("/ivy/post", ivyPost.ugc);
router.post("/ivy/post", multiFile, ivyPost.createUGC);
router.get("/ivy/post/public", ivyPost.ugcPublic);
router.delete("/ivy/post/:postId", ivyPost.deletePost);
router.get("/ivy/homefeed/posts", ivyHomefeed.userAndPost);
router.get("/ivy/connection", ivyConnection.connectionGet);

//main route
router.get("/", (req, res) => {
  setTimeout(function () {
    res
      .status(401)
      .send({ message: "Unauthorised", token: "Please provide access token" });
  }, 2000);
});

module.exports = router;
