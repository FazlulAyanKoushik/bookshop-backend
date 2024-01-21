const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        categoryName: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true
        },
        books: [{
            type: Schema.Types.ObjectId,
            ref: 'Book'
        }],
        metaDesc: {
            type: String,
            required: false
        },
        metaTag: {
            type: String,
            required: true
        },
        imgUrl: {
            type: String,
            required: false
        },
        keyword: {
            type: String,
            required: true
        }
    }
)

module.exports = mongoose.model('Category', schema);
