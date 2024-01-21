const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        primaryPhoneNo: {
            type: String,
            required: true
        },
        secondaryPhoneNo: {
            type: String,
            required: false
        },
        addressLineOne: {
            type: String,
            required: true
        },
        addressLineTwo: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: true
        },
        facebookLink: {
            type: String,
            required: false
        },
        youtubeLink: {
            type: String,
            required: false
        },
        instagramLink: {
            type: String,
            required: false
        },
        twitterLink: {
            type: String,
            required: false
        },
        shopOpenTime: {
            type: String,
            required: false
        },
        notification: {
            type: String,
            required: false
        },
    }
)

module.exports = mongoose.model('ContactInfo', schema);
