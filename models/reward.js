const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        purchaseAmount: {
            type: Number,
            required: true
        },
        point: {
            type: Number,
            required: true
        },
        unitPoint: {
            type: Number,
            required: true
        }
    }
)

module.exports = mongoose.model('Reward', schema);
