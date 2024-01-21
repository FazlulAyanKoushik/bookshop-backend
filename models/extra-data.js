
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema(
    {
        deliveryInDhaka: {
            type: Number,
            required: true
        },
        deliveryOutsideDhaka: {
            type: Number,
            required: true
        },
        deliveryOutsideBD: {
            type: Number,
            required: false
        },
        giftWrapPrice: {
            type: Number,
            required: true
        },
        expressDelivery: {
            type: Number,
            required: true
        },
        sameDayDelivery: {
            type: Number,
            required: true
        },
        logoUrl: {
            type: String,
            required: false
        },
        // extra: [{
        //     type: Schema.Types.ObjectId,
        //     ref: '',
        //     required: false
        // }],
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('ExtraData', schema);
