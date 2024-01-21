const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        authorId: {
            type: String,
            required: true
        },
        categories: [{
            type: Schema.Types.ObjectId,
            ref: 'SubCategory'
        }],
        publishers: [{
            type: Schema.Types.ObjectId,
            ref: 'Publisher'
        }],
    }
)

module.exports = mongoose.model('AuthorFilter', schema);
