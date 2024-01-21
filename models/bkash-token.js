const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    id_token: {
        type: String,
        required: true
    },
    token_type: {
        type: String,
        required: true
    },
    expires_in: {
        type: String,
        required: true
    },
    refresh_token: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});


module.exports = mongoose.model('BkashToken', schema);