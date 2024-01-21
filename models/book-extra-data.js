const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
    {
        translator: {
            type: Schema.Types.ObjectId,
            ref: 'Author'
        },
        translatorName: {
            type: String,
            required: false
        },
        isbn: {
            type: String,
            required: false
        },
        edition: {
            type: String,
            required: false
        },
        editor: {
            type: String,
            required: false
        },
        numberOfPages: {
            type: Number,
            required: false
        },
        country: {
            type: String,
            required: false
        },
        language: {
            type: String,
            required: false
        },
        summery: {
            type: String,
            required: false
        },
        ratingsCount: {
            type: Number,
            required: false
        },
        ratingsValue: {
            type: Number,
            required: false
        },
        reviews: [{
            type: Schema.Types.ObjectId,
            ref: 'Review',
            required: false
        }]
    }
);

module.exports = mongoose.model('BookExtraData', productSchema);
