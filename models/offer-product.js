const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        priorityNumber: {
            type: Number,
            required: true
        },
        tagName: {
            type: String,
            required: true
        },
        tagSlug: {
            type: String,
            required: true
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        }
    }
)

module.exports = mongoose.model('OfferList', schema);
