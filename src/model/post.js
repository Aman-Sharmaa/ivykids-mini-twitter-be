const express = require("express");
const mongoose = require("mongoose");

const DataPost = new mongoose.Schema({
  userId: {
    type: String,
  },
  postImage: {
    type: Array,
  },
  postQuestion: {
    type: String,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  updateDate: {
    type: Date,
    default: Date.now,
  },
});

const post = new mongoose.model("post", DataPost);
module.exports = post;
