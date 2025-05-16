const mongoose = require('mongoose');
const schema = mongoose.Schema({
    userId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "userId is required"],
    },
    type: {
        type: String,
        enum: ["buy", "sell"],
        required: true,
    },
    token: {
        type: String,
        enum: ["ETH","USDT"], 
        required: true,
    },
    amount :{
        type: Number,
        required: [true, "Amount is required"],
    },
    price :{
        type: Number,
        required: [true, "Ethereum address is required"],
    },
    status: {
        type: String,
        enum: ["open", "matched", "cancelled"],
        default: "open",
    },
    createdAt :{
        type: Date,
        default: Date.now
    },
})

const Orders = mongoose.model('Orders', schema);
module.exports = Orders;