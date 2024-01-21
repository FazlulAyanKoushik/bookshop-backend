const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        title: {
            type: String,
            required: false
        },
        subTitle: {
            type: String,
            required: false
        },
        image: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
    }
)
module.exports = mongoose.model('OfferSlider', schema);
