const reg = require("../../model/register");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.ivyRegistration = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required", status: false });
    }
    const existingUser = await reg.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email already exists", status: false });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;

    const userProfileImages = [
      "1.png",
      "2.png",
      "3.png",
      "4.png",
      "5.png",
      "6.png",
      "7.png",
      "8.png",
      "9.png",
      "10.png",
      "11.png",
      "12.png",
      "13.png",
      "14.png",
      "15.png",
      "16.png",
      "17.png",
      "18.png",
      "19.png",
      "20.png",
      "21.png",
      "22.png",
      "23.png",
      "24.png",
      "25.png",
      "26.png",
      "27.png",
      "28.png",
      "29.png",
      "30.png",
      "31.png",
      "32.png",
      "33.png",
      "34.png",
      "35.png",
      "36.png",
    ];

    const randomIndex = Math.floor(Math.random() * userProfileImages.length);
    const randomImage = userProfileImages[randomIndex];
    req.body.userProfile = "https://api.multigrad.in/avatars/" + randomImage;

    const newUser = new reg(req.body);
    const user = await newUser.save();
    const payload = {
      user: {
        id: user._id,
        email: user.email,
      },
    };
    const userToken = jwt.sign(payload, process.env.JWT_SECRET);

    res.json({ status: true, userToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error", status: false });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await reg.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).json({ message: "Invalid Password" });
    }
    const payload = {
      user: {
        id: user._id,
        email: user.email,
        campusCode: user.campusCode,
        classOrCourse: user.classOrCourse,
        roadMapName: user.roadMapName,
      },
    };
    const userToken = jwt.sign(payload, process.env.JWT_SECRET);
    res.json({ status: true, userToken });
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
};
