const mongoose = require('mongoose');
const Schema = mongoose.Schema;

exports.bookPriceExtra = new Schema(
    {
        format: {
            type: String,
            required: true
        },
        condition: {
            type: [Object],
            required: false
        }
    },
    {
        _id: false
    }
);

exports.bookPriceData = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: false
        },
        discount: {
            type: Number,
            required: false
        },
        quantity: {
            type: Number,
            required: false
        }
    },
    {
        _id: true
    }
);


exports.range = new Schema(
    {
        min: {
            type: Number,
        },
        max: {
            type: Number
        }
    },
    {
        _id: false
    }
);

exports.address = new Schema(
    {
        addressType: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        phoneNo: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        alternativePhoneNo: {
            type: String,
            required: false
        },
        city: {
            type: String,
            required: true
        },
        area: {
            type: String,
            required: true
        },
        zone: {
            type: String,
            required: false
        },
        postCode: {
            type: String,
            required: false
        },
        shippingAddress: {
            type: String,
            required: true
        },
    },
    {
        _id: true
    }
);

exports.orderItem = new Schema(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Book',
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        discountType: {
            type: Number,
            required: false
        },
        discountAmount: {
            type: Number,
            required: false
        },
        quantity: {
            type: Number,
            required: true
        },
        orderType: {
            type: String,
            required: true
        },
        format: {
            type: String,
            required: false
        },
        formatCondition: {
            type: String,
            required: false
        },
    },
    {
        _id: true
    }
);

exports.orderItemNew = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
            ref: 'Book',
            required: true
        },
        name: {
            type: String,
            required: false
        },
        slug: {
            type: String,
            required: false
        },
        image: {
            type: String,
            required: false
        },
        category: {
            type: String,
            required: false
        },
        subCategory: {
            type: String,
            required: false
        },
        author: {
            type: String,
            required: false
        },
        publisher: {
            type: String,
            required: false
        },
        regularPrice: {
            type: Number,
            required: false
        },
        unitPrice: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        orderType: {
            type: String,
            required: true
        },
        format: {
            type: String,
            required: false
        },
        formatCondition: {
            type: String,
            required: false
        },
    },
    {
        _id: true
    }
);

exports.onSaleProduct = new Schema(
    {
        book: {
            type: Schema.Types.ObjectId,
            ref: 'Book',
            required: true
        },
        priority: {
            type: Number,
            required: false
        }
    },
    {
        _id: true
    }
)
