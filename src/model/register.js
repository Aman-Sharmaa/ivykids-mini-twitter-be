const express = require("express");
const mongoose = require("mongoose");

const registration = new mongoose.Schema({
  fullName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    default: "null",
  },
  userProfile: {
    type: String,
    default: "null",
  },
  userAbout: {
    type: String,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const reg = new mongoose.model("reg", registration);
module.exports = reg;
