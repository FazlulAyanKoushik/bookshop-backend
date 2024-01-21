const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        tagName: {
            type: String,
            required: true
        },
        tags: {
            type: [String],
            required: false
        },
        tagSlug: {
            type: String,
            required: true
        }
    }
)

module.exports = mongoose.model('Tag', schema);
