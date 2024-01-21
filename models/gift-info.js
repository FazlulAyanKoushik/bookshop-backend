const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        willWrapGift: {
            type: Boolean,
            required: false
        },
        receiverName: {
            type: String,
            required: true
        },
        receiverCity: {
            type: String,
            required: true
        },
        receiverArea: {
            type: String,
        },
        receiverShippingAddress: {
            type: String,
        },
        receiverPhoneNo: {
            type: String
        },
        alernativePhoneNo: {
            type: String
        },
        message: {
            type: String
        },
        occasion: {
            type: String
        }
    },
    {
        timestamps: false
    }
);


module.exports = mongoose.model('GiftInfo', schema);
