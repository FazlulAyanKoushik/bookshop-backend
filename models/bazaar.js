const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema(
    {
        categoryName: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true
        },
        image: {
            type: String
        },
    }
)


const bazaarSchema = new Schema(
    {
        bazaarName: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true
        },
        categories: {
            type: [categorySchema],
            required: false
        }
    },
);

const Bazaar = mongoose.model('Bazaar', bazaarSchema);
module.exports = Bazaar;
