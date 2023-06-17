const express = require("express");
const post = require("../../model/post");
const app = express();
const http = require("http").Server(app);

exports.ugc = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // default to page 1
    const sort = req.query.sort || "-createdAt";
    const perPage = 10;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const posts = await post
      .find({ userId: req.user.id })
      .sort(sort)
      .skip(startIndex)
      .limit(perPage);
    const totalCount = await post.countDocuments();
    const totalPages = Math.ceil(totalCount / perPage);
    const response = {
      message: "success",
      status: true,
      data: posts,
      currentPage: page,
      totalPages: totalPages,
    };

    res.send(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Internal server error" });
  }
};

exports.createUGC = async (req, res) => {
  try {
    if (!req.files["postImage"]) {
      var postImage = null;
    } else {
      postImage =
        "https://api.multigrad.in/open/media/?file=" +
        req.files["postImage"][0].filename;
    }
    const createPost = new post({
      userId: req.user.id,
      fullName: req.user.fullName,
      userProfile: req.user.userProfile,
      postDescription: req.body.postDescription,
      postImage: postImage,
      postPrivacy: req.body.postPrivacy,
      postQuestion: req.body.postQuestion,
      postAnswer: req.body.postAnswer,
      postLink: req.body.postLink,
      createdAt: post.createdDate,
    });
    createPost.save();
    res.send({
      message: "Post created successfully",
      status: true,
      createPost,
    });
  } catch {
    res.send({ message: "falied", status: 201 });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const deletedPost = await post.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    return res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
