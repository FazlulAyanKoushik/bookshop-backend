const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const subSchema = require('./sub-schema-model');

const schema = new Schema(
    {
        orderId: {
            type: String,
            required: true,
            unique: true
        },
        checkoutDate: {
            type: String,
            required: true
        },
        deliveryDate: {
            type: Date,
            required: false
        },

        deliveryStatus: {
            type: Number,
            required: true
        },
        deliveryType:{
            type: String,
            required: false
        },
        hasPreorderItem:{
            type: Boolean,
            required: false
        },
        isGiftWrap: {
            type: Boolean,
            required: false
        },
        isGift: {
            type: Boolean,
            required: false
        },
        giftInfo: {
            type: Object,
            required: false
        },
        discountTypes: {
            type: [Object],
            required: false
        },
        // Amount Area
        subTotal: {
            type: Number,
            required: true
        },
        deliveryCharge: {
            type: Number,
            required: true
        },
        giftWrapPrice: {
            type: Number,
            required: false
        },
        discount: {
            type: Number,
            required: false
        },
        grandTotal: {
            type: Number,
            required: true
        },

        paymentType: {
            type: String,
            required: true
        },

        paymentStatus: {
            type: String,
            required: true
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false
        },
        // User Address
        name: {
            type: String,
            required: true
        },
        phoneNo: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        alternativePhoneNo: {
            type: String,
            required: false
        },
        city: {
            type: String,
            required: false
        },
        area: {
            type: String,
            required: false
        },
        zone: {
            type: String,
            required: false
        },
        shippingAddress: {
            type: String,
            required: true
        },
        orderTimeline: {
            others: {
                type: Boolean,
                required: false
            },
            othersData: {
                type: Date,
                required: false
            },
            orderPlaced: {
                type: Boolean,
                required: false
            },
            orderPlacedDate: {
                type: Date,
                required: false
            },
            orderProcessing: {
                type: Boolean,
                required: false
            },
            orderProcessingDate: {
                type: Date,
                required: false
            },
            orderPickedByDeliveryMan: {
                type: Boolean,
                required: false
            },
            orderPickedByDeliveryManDate: {
                type: Date,
                required: false
            },
            orderDelivered: {
                type: Boolean,
                required: false
            },
            orderDeliveredDate: {
                type: Date,
                required: false
            },
        },

        orderedItems: [subSchema.orderItemNew],
        orderNotes: {
            type: String,
            required: false
        },
        sessionkey: {
            type: String,
            required: false
        },
        orderPaymentInfo: {
            type: Schema.Types.ObjectId,
            ref: "OrderPaymentInfo",
            required: false
        },
        bkashPaymentId: {
            type: String,
            required: false
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('OrderNew', schema);
