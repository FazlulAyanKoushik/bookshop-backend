const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        urlCode: {
            type: String,
            required: false
        },
        longUrl: {
            type: String,
            required: false
        },
        shortUrl: {
            type: String,
            required: false
        },
        date: {
            type: String,
            required: false
        }
    }
)

module.exports = mongoose.model('UrlShortener', schema);
