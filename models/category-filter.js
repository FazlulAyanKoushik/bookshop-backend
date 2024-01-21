const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        categoryId: {
            type: String,
            required: true
        },
        subCats: [{
            type: Schema.Types.ObjectId,
            ref: 'SubCategory'
        }],
        authors: [{
            type: Schema.Types.ObjectId,
            ref: 'Author'
        }],
        publishers: [{
            type: Schema.Types.ObjectId,
            ref: 'Publisher'
        }],
        companies: [{
            type: Schema.Types.ObjectId,
            ref: 'Company'
        }],
    }
)

module.exports = mongoose.model('CategoryFilter', schema);
