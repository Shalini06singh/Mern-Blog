const mongoose = require('mongoose')

const userSchema =  new mongoose.Schema({
    name:
    {
        type: String,
        required: true,
        
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required : true
    },
    contact: {
        type: String,
        required:false
    },
    image: {
        type: String,
        required:false
    },
    status:{
        type: Boolean,
        default: false
    },
    token:{
        type: String,
        required:false
    }
});

const userModel = mongoose.model('User', userSchema)

module.exports = userModel;
