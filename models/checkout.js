const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema(
    {
        userId: {
            type: String,
            required: true
        },
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
            required: true
        },
        city: {
            type: String,
            required: true
        },

        area: {
            type: String,
            required: true
        },
        shippingAddress: {
            type: String,
            required: true
        },
        subTotal: {
            type: Number,
            required: true
        },
        payable: {
            type: Number,
            required: true
        },
        shippingFee: {
            type: Number,
            required: true
        },

        discount: {
            type: Number,
            required: false
        },

        couponId: {
            type: String,
            required: false
        },

        couponValue: {
            type: Number,
            required: false
        },
        cartProducts: {
            type: [Object],
            required: true
        },
        paymentType: {
            type: String,
            required: true
        },
        deliveryStatus: {
            type: String
        },
        status: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Checkout', schema);
