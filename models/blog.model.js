const mongoose = require('mongoose')

const blogSchema =  new mongoose.Schema({
    title:
    {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required : false
    },
    description: {
        type: String,
        required:false
    },
    status:{
        type: Boolean,
        default: false
    }
});

const blogModel = mongoose.model('Blog', blogSchema)

module.exports = blogModel;
