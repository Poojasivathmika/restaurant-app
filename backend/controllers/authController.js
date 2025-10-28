const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Owner login & get token
// @route   POST /api/auth/login
const ownerLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ username: email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// @desc    Seed the initial Owner account (Run once!)
// @route   POST /api/auth/seed
const seedOwner = asyncHandler(async (req, res) => {
  const username = process.env.OWNER_USERNAME;
  const password = process.env.OWNER_PASSWORD;

  const userExists = await User.findOne({ username });

  if (userExists) {
    return res.status(400).json({ message: 'Owner account already seeded' });
  }

  const user = await User.create({ username, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      message: 'Owner account created successfully. DELETE this route after first use.',
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
});

// @desc    Reset/overwrite owner account (development helper)
// @route   POST /api/auth/reset
const resetOwner = asyncHandler(async (req, res) => {
  const username = process.env.OWNER_USERNAME;
  const password = process.env.OWNER_PASSWORD;

  // Remove existing owner user(s) and recreate to ensure known password
  await User.deleteMany({ username });
  const user = await User.create({ username, password });

  if (user) {
    res.status(200).json({ message: 'Owner account reset', username: user.username });
  } else {
    res.status(500).json({ message: 'Failed to reset owner account' });
  }
});

module.exports = { ownerLogin, seedOwner, resetOwner };