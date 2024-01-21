const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    email: {
        type: String,
        required: true
    },

}, {
    timestamps: true
});


module.exports = mongoose.model('Newsletter', schema);