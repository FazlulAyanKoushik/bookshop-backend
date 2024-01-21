const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        priority: {
            type: Number,
            required: true
        },
    }
)

module.exports = mongoose.model('Menu', schema);
