const express = require("express");
const router = express.Router();
const Balances = require("../model/balnces");
require("dotenv").config();

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

module.exports = router;