const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const bookSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true
        },
        image: {
            type: Object,
            required: false
        },
        pdfUrl: {
            type: String,
            required: false
        },
        price: {
            type: Number,
            required: true
        },
        priceData: {
            type: Schema.Types.ObjectId,
            ref: 'PriceDataExtra',
            required: false
        },
        discountPercent: {
            type: Number,
            required: false
        },
        showStock: {
            type: Boolean,
            required: false
        },
        availableQuantity: {
            type: Number,
            required: false
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        categorySlug: {
            type: String,
            required: true
        },
        categoryName: {
            type: String,
            required: true
        },
        subCategory: {
            type: Schema.Types.ObjectId,
            ref: 'SubCategory',
            required: true
        },
        subCatSlug: {
            type: String,
            required: true
        },
        subCatName: {
            type: String,
            required: true
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'Author',
            required: false
        },
        authorName: {
            type: String,
            required: false
        },
        authorSlug: {
            type: String,
            required: false
        },
        additionalAuthor: [],
        publisher: {
            type: Schema.Types.ObjectId,
            ref: 'Publisher',
            required: false
        },
        publisherName: {
            type: String,
            required: false
        },
        publisherSlug: {
            type: String,
            required: false
        },
        // Pre Book or Regular Book
        orderTypeName: {
            type: String,
            required: true
        },
        orderTypSlug: {
            type: String,
            required: true
        },
        isChildSuitable: {
            type: Boolean,
            required: false
        },
        preOrderReleaseDate: {
            type: Date,
            required: false
        },
        bookExtraData: {
            type: Schema.Types.ObjectId,
            ref: 'BookExtraData',
            required: false
        },
        package: {
            type: Boolean,
            required: false
        },
        packages: [{
            type: Schema.Types.ObjectId,
            ref: 'Book',
            required: false
        }],
        soldQuantity: {
            type: Number,
            required: false
        },
        // For Bookish Gadgets
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: false
        },
        companyName: {
            type: String,
            required: false
        },
        companySlug: {
            type: String,
            required: false
        },
        shortDesc: {
            type: String,
            required: false
        },
        tag: {
            type: Schema.Types.ObjectId,
            ref: 'Tag',
        },
        ratingReview: [{
            type: Schema.Types.ObjectId,
            ref: 'ProductRatingReview'
        }],
        metaTitle: {
            type: String,
            required: false
        },
        metaKeyword: {
            type: String,
            required: false
        },
        metaDesc: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Book', bookSchema);
