const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        pageName: {
            type: String,
            required: true
        },
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

module.exports = mongoose.model('Seo', schema);
