const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

require("dotenv").config();

const User = require("../models/User");

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ message: "please enter valid input fields" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "user already exist!" });
    const newUser = await User.create({
      username,
      email,
      password,
    });
    const id = newUser._id;
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '3h',
    });
    res.cookie("token", token, {
      maxAge: 1000 * 60 * 60 * 3, // 3 hours
      httpOnly: true,
    });
    res.status(201)
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "server downtime please try again after few mins!" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await user.comparePassword(password); // ✅ use schema method
  if (!isMatch) return res.status(401).json({ message: "Invalid password" });

  res.status(200).json({ message: "Login successful!" });
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Please enter valid input fields" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password); // schema method
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    res.cookie("token", token, {
      maxAge: 1000 * 60 * 60 * 3,
      httpOnly: true,
    });

    // ✅ Optional: Send JSON for frontend info
    res.status(200).json({ message: "Login successful!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error, please try again later." });
  }
});


module.exports = router;
