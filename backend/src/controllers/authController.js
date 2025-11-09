const User = require("../models/User");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/jwt");
const { validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");


// POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => err.msg),
    });
  }

  const { name, email, phone, password } = req.body;

  // Check duplicate email or phone
  const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
  if (existingUser)
    return res.status(400).json({ message: "Email or phone already registered" });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

// POST /api/auth/login
const loginUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => err.msg),
    });
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user)
    return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({ message: "Invalid credentials" });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

// GET /api/auth/me
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

// PUT /api/auth/profile
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Update only provided fields
  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;
  user.fcmToken = req.body.fcmToken || user.fcmToken;

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    fcmToken: updatedUser.fcmToken,
  });
});

module.exports = { registerUser, loginUser, getProfile, updateProfile };
