const mongoose = require('mongoose');
const schema = mongoose.Schema({
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"]
    },
    wallet:{
        type: String,
        required: [true, "Wallet address is required"]
    },
    privateKey:{
        type: String,
        required: [true, "Private key is required"]
    },
    eth:{
        type: Number,
        required: [true, "ETH status is required"]
    },
    usdt:{
        type: Number,
        required: [true, "USDT status is required"]
    },

})

const Blances = mongoose.model('Blances', schema);
module.exports = Blances;