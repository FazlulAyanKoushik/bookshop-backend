const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        authorName: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true
        },
        image: {
            type: String,
        },
        about: {
            type: String
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

module.exports = mongoose.model('Author', schema);
