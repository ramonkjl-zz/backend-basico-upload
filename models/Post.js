const mongoose = require('mongoose')

const Post = new mongoose.Schema({
    name: String,
    description: String,
    photo_name: String,
    photo_key: String,
    photo_url: String,
    createdAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Post', Post)