const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        subCatId: {
            type: String,
            required: true
        },
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
        }]
    }
)

module.exports = mongoose.model('SubCategoryFilter', schema);
