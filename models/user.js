
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const subSchema = require('./sub-schema-model')


const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true
        },

        // NEW
        address: [subSchema.address],
        phoneNo: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: false
        },
        gender: {
            type: String,
            required: false
        },
        birthdate: {
            type: Date,
            required: false
        },
        username: {
            type: String,
            required: true
        },
        profileImg: {
            type: String
        },
        password: {
            type: String,
            required: false
        },
        isEmailVerified: {
            type: Boolean,
            required: false
        },
        registrationAt: {
            type: Date,
            default: Date.now(),
            required: true,
        },
        registrationType: {
            type: String,
            required: false
        },
        // Facebook
        uID: {
            type: String,
            required: false
        },
        dateOfBirth: {
            type: Date,
            required: false
        },
        occupation: {
            type: String,
            required: false
        },
        organization: {
            type: String,
            required: false
        },
        secondaryPhoneNo: {
            type: String,
            required: false
        },

        wishlists: [{
            type: Schema.Types.ObjectId,
            ref: 'Wishlist'
        }],

        carts: [{
            type: Schema.Types.ObjectId,
            ref: 'Cart'
        }],

        // NEW
        checkouts: [{
            type: Schema.Types.ObjectId,
            ref: 'Order'
        }],
        orders: [{
            type: Schema.Types.ObjectId,
            ref: 'OrderNew'
        }],
        // NEW
        usedCoupons: [{
            type: Schema.Types.ObjectId,
            ref: 'Coupon'
        }],
        reviews: [{
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }],
        // NEW
        rewardPoints: {
            type: Number,
            default: 0
        },
        // NEW
        purchasedAmount: {
            type: Number,
            default: 0
        },
        isPhoneVerified: {
            type: Boolean,
            required: true
        },
        hasAccess: {
            type: Boolean,
            required: true
        }
    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model('User', userSchema);
