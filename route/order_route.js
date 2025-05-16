const express = require("express");
const router = express.Router();
const Order = require("../model/order");
require("dotenv").config();

router.post("/createOrder", async (req, res) => {
    const { userId, type, token, amount, price } = req.body;
    try {
        const newOrder = new Order({ userId, type, token, amount, price });
        await newOrder.save();
        res.status(201).json({ message: "Order created successfully", order: newOrder });
    } catch (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
router.get("/getOrder", async (req,res) => {
   
    try {
        const orders = await Order.find({status: "open"});
        if (!orders) {
            return res.status(404).json({ message: "No orders found" });
        }
        return res.status(200).json({ orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;