const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        status: {
            type: String,
            required: false
        },
        tran_date: {
            type: Date,
            required: false
        },
        tran_id: {
            type: String,
            required: false
        },
        val_id: {
            type: String,
            required: false
        },
        amount: {
            type: Number,
            required: false
        },
        store_amount: {
            type: Number,
            required: false
        },
        card_type: {
            type: String,
            required: false
        },
        card_no_: {
            type: String,
            required: false
        },
        currency: {
            type: String,
            required: false
        },
        bank_tran_id: {
            type: String,
            required: false
        },
        card_issuer: {
            type: String,
            required: false
        },
        card_brand: {
            type: String,
            required: false
        },
        card_issuer_country: {
            type: String,
            required: false
        },
        card_issuer_country_code: {
            type: String,
            required: false
        },
        currency_type: {
            type: String,
            required: false
        },
        currency_amount: {
            type: Number,
            required: false
        }
    },
    {
        timestamps: false
    }
);

module.exports = mongoose.model('OrderPaymentInfo', schema);
