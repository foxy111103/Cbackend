const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Balances = require("../model/balnces");
require("dotenv").config();

//register route
router.post("/register",async(req, res) => {
    const { name, email, password,AccountAddress } = req.body;
    const existingUser = await User.findOne({ email });
    const ethExists = await User.findOne({ AccountAddress });
    try{
        if (existingUser)// Check if the user already exists
            return res.status(400).json({ msg: "Email already registered" });
      
        
        if (ethExists) // Check if the Ethereum address is already used
            return res.status(400).json({ msg: "Ethereum address already in use" });
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt); //password hashing

        const newUser = new User({ name, email, password: passwordHash, AccountAddress: AccountAddress });
        await newUser.save();

        const balancees= new Balances({ userid: newUser._id, eth: "1.5", usdt: "5000" });      
        await balancees.save();  
        //jwt token generation
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        
        res.json({ token, user: { id: newUser._id, name, email, AccountAddress } });
  
    }
    catch (error) {
        console.error("Error checking for existing user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
})

//login route
router.post("/login", async (req, res) => {
    const { email, pass } = req.body;
    const user = await User.findOne({ email });
    try{
        if (!user) return res.status(400).json({ msg: "User does not exist" });
        // const salt = await bcrypt.genSalt(10);
        // const passwordHash = await bcrypt.hash(password, salt); //password hashing
        const isMatch = await bcrypt.compare(pass,user.password); //password comparison
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
        
        //jwt token generation
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, user: { id: user._id, name: user.name, email, AccountAddress: user.AccountAddress } });
  
    }
    catch (error) {
        console.error("Error checking for existing user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
router.get("/getUser", async (req, res) => {
    const { userId } = req.query;
    try {
        const user = await User.findOne({_id: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }               
        return res.status(200).json({ user });
    } catch (error) {   
        console.error("Error fetching User:", error);
        return res.status(500).json({ message: "Internal server error" });
    }

});

module.exports = router;
