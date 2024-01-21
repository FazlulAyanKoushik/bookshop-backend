const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const subSchema = require('./sub-schema-model');

const schema = new Schema(
    {
        priceExtra: {
            type: [Object],
            required: false
        }
    }
);

module.exports = mongoose.model('PriceDataExtra', schema);
