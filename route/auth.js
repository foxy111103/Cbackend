const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Balances = require("../model/balnces");
require("dotenv").config();
const ethers = require("ethers");

// Register Route
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "Email already registered" });

    // Generate Ethereum wallet
    const wallet = ethers.Wallet.createRandom();
    const walletAddress = wallet.address;
    const privateKey = wallet.privateKey;

    // Hash password & private key
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const hashedPrivateKey = await bcrypt.hash(privateKey, salt);

    // Save user
    const newUser = new User({
      name,
      email,
      password: passwordHash,
      AccountAddress: walletAddress,
    });
    await newUser.save();

    // Save balances
    const balanceRecord = new Balances({
      userid: newUser._id,
      wallet: walletAddress,
      privateKey: hashedPrivateKey,
      eth: 0,
      usdt: 0,
    });
    await balanceRecord.save();

    // Generate token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user: { id: newUser._id, name, email } });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, pass } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User does not exist" });

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user: { id: user._id, name: user.name, email } });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get User by ID
router.get("/getUser", async (req, res) => {
  const { userId } = req.query;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });

  } catch (error) {
    console.error("Fetch user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
