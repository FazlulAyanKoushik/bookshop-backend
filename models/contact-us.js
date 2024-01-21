const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    phoneNo: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    queryType: {
        type: String,
        required: false
    },
    subject: {
        type: String,
        required: false
    },
    message: {
        type: String,
        required: false
    },
    receivingMails: {
        type: [String],
        required: false
    },
    emailSent: {
        type: Boolean,
        required: false
    },
}, {
    timestamps: true,
    versionKey: false
});


module.exports = mongoose.model('ContactUs', schema);
