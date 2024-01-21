const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        publisherId: {
            type: String,
            required: true
        },
        authors: [{
            type: Schema.Types.ObjectId,
            ref: 'Author'
        }],
        categories: [{
            type: Schema.Types.ObjectId,
            ref: 'SubCategory'
        }],
    }
)

module.exports = mongoose.model('PublisherFilter', schema);
