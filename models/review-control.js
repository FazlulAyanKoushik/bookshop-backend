const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    book: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    reviewDate: {
        type: Date,
        required: false,
        default: Date.now()
    },
    review: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    reply: {
        type: String,
        required: false
    },
    replyDate: {
        type: Date,
        required: false
    },
}, {
    timestamps: true,
    versionKey: false
});


module.exports = mongoose.model('Review', schema);
