const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    description: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model('PageInfo', schema);
