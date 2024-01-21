const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        companyName: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true
        }
    }
)

module.exports = mongoose.model('Company', schema);
