const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    title: {
        type: String,
        required: true
    },
    titleBangla: {
        type: String,
        required: false
    },
    slug: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    priority: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Blog', schema);