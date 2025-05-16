const mongoose = require('mongoose');
const schema = mongoose.Schema({
    name :{
        type: String,
        required: [true, "Name is required"]
    },
    email :{
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password :{
        type: String,
        required: [true, "Password is required"]
    },
    AccountAddress :{
        type: String,
        required: [true, "Account address is required"],
        unique: true
    },
})

const User = mongoose.model('User', schema);
module.exports = User;