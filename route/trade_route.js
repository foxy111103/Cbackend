const express = require("express");
const router = express.Router();
const Trade = require("../model/trade");
const Order = require("../model/order");
const User = require("../model/user");
const Balances = require("../model/balnces");
require("dotenv").config();

router.post("/Order", async (req, res) => {
    const { userId, type, token, amount, price } = req.body;
    const newOrder = new Order({ userId, type, token, amount, price });
    await newOrder.save();

    const oppositeType = type === "buy" ? "sell" : "buy";
    
    const match=await Order.findOne({
        userId: { $ne: userId },
        type: oppositeType,
        token,
        price,
        status: "open",
        
    })

    if (match) {
        buyUserbalance = await Balances.findOne({ userid: newOrder.userId });
        sellUserbalance= await Balances.findOne({userid: match.userId});
        if (!buyUserbalance || !sellUserbalance) {
                return res.status(404).json({ message: "User balance not found" });
            }
        if (newOrder.type === "buy" ){
            
            if (buyUserbalance.usdt < amount * price) {
                return res.status(400).json({ message: "Insufficient USDT balance" });
            }
            
            buyUserbalance.usdt=buyUserbalance.usdt-amount*price;
            buyUserbalance.eth=buyUserbalance.eth+amount;
            
            sellUserbalance.usdt=sellUserbalance.usdt+amount*price;
            sellUserbalance.eth=sellUserbalance.eth-amount;
            

        }
        else{
            if (buyUserbalance.eth < amount) {
                return res.status(400).json({ message: "Insufficient ETH balance" });
            }
            buyUserbalance.usdt=buyUserbalance.usdt+amount*price;
            buyUserbalance.eth=buyUserbalance.eth-amount;
            
            
            sellUserbalance.usdt=sellUserbalance.usdt-amount*price;
            sellUserbalance.eth=sellUserbalance.eth+amount;
            
        }
        await buyUserbalance.save();
        await sellUserbalance.save();

        newOrder.status = "matched";
        match.status = "matched";
        await newOrder.save();
        await match.save();

        const trade = new Trade({
            BuyId: type === "buy" ? userId : match.userId,
            SellId: type === "sell" ? userId : match.userId,
            amount: Math.min(amount, match.amount),
            price,
        });
        await trade.save();

        return res.status(201).json({
            message: "Order matched and trade executed",
            trade,
          });
    } 
    else {
        newOrder.status = "open";
        await newOrder.save();

        return res.status(201).json({
        message: "Order created successfully",
        order: newOrder,
      });
    }

    


});
router.get("/getTrades", async (req,res) => {
   const { userId } = req.query;
    try {
      let history = await Trade.find({ BuyId: userId });

      if (history.length === 0) {
      const orders = await Trade.find({ SellId: userId });

      if (orders.length === 0) {
        return res.status(404).json({ message: "No trades found" });
      }

      history = orders;
      }

        
     return res.status(200).json({ history });
    } catch (error) {
        console.error("Error fetching Trades:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;