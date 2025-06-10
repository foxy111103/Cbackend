const express = require("express");
const router = express.Router();
const Balances = require("../model/balnces");
require("dotenv").config();
const { ethers } = require("ethers");




router.get("/getbalance", async (req,res) => {
    const { userId } = req.query;
    try {
        const balance = await Balances.findOne({userid: userId });
        if (!balance) {
            return res.status(404).json({ message: "No balance found" });
        }               
        return res.status(200).json({ balance });
    } catch (error) {   
        console.error("Error fetching balance:", error);
        return res.status(500).json({ message: "Internal server error" });
    }

    
});

router.post("/update", async (req,res) => {
    const { userId, txHash, currency,amount } = req.body;
    try {
        if (!userId || !txHash || !currency || !amount) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const balance = await Balances.findOne({userid: userId });
        if (!balance) {
            return res.status(404).json({ message: "No User found" });
        }  
        // Check if the transaction hash is valid
        if (!ethers.isHexString(txHash)) {
            return res.status(400).json({ message: "Invalid transaction hash" });
        }
        // Check if the currency is valid
        if (currency !== "eth" && currency !== "usdt") {
            return res.status(400).json({ message: "Invalid currency type" });
        }
        // Check if the amount is a valid number
        const amountNumber = parseFloat(amount);
        if (isNaN(amountNumber) || amountNumber <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }
        // Update the balance based on the currency
        if (currency === "eth") {
            balance.eth += amountNumber;
        } else if (currency === "usdt") {
            balance.usdt += amountNumber;
        }

        await balance.save();

        return res.status(200).json({ message: "Balance updated successfully" });



    } catch (error) {   
        console.error("Error updating balance:", error);
        return res.status(500).json({ message: "Internal server error" });
    }

    
});

module.exports = router;