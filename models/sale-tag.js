const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const subSchema = require('./sub-schema-model');

const schema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true
        },
        priority: {
            type: Number,
            required: false
        },
        books: [subSchema.onSaleProduct]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('SaleTag', schema);
