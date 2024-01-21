const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Book',
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        selectedQty: {
            type: Number,
            required: true
        },
        orderType: {
            type: String,
            required: false
        },
        format: {
            type: String,
            required: false
        },
        formatCondition: {
            type: String,
            required: false
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Cart', schema);
