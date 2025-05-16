const mongoose = require('mongoose');
const schema = mongoose.Schema({
    BuyId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Orders',
        required: [true, "Buy order id is required"],
    },
    SellId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Orders',
        required: [true, "Sell order id is required"],
    },
    amount :{
        type: Number,
        required: [true, "Amount is required"],
    },
    price :{
        type: Number,
        required: [true, "Ethereum address is required"],
    },
    TradeTime :{
        type: Date,
        default: Date.now
    },
})

const Trade = mongoose.model('Trades', schema);
module.exports = Trade;