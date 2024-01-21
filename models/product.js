const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const productSchema = new Schema(
    {
        productName: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true
        },
        regularPrice: {
            type: Number,
            required: true
        },
        salePrice: {
            type: Number,
            required: true
        },
        bazaar: {
            type: String,
            required: true
        },
        bazaarSlug: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        categorySlug: {
            type: String,
            required: true
        },
        brand: {
            type: String,
            required: false
        },
        productCode: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        tag: {
            type: [String]
        },
        primaryImage: {
            type: String
        },
        productImages: {
            type: [String]
        },
        shortDecs: {
            type: String
        },
        desc: {
            type: String
        },
        ratings: {
            type: Object
        },
        reviews: {
            type: [String]
        }
    },
    {
        timestamps: true
    }
);

// productSchema.plugin(mongoose_fuzzy_searching, { fields: ['productName', 'slug'] });
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
