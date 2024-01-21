const {validationResult} = require('express-validator');

// Require Post Schema from Model..
const Cart = require('../models/cart');
const User = require('../models/user');

/**
 * Add To Cart
 * Get Category List
 * Get Single Category
 * Delete Category
 * Edit Category
 */
exports.addToCart = async (req, res, next) => {

    const userId = req.userData.userId;
    const data = req.body;
    const final = {...data, ...{user: userId}}

    try {
        const cart = new Cart(final);
        const cartRes = await cart.save();

        await User.findOneAndUpdate({_id: userId}, {
            "$push": {
                carts: cartRes._id
            }
        })
        res.status(200).json({
            message: 'Added to Cart Successfully!'
        });
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getCartItemByUserId = async (req, res, next) => {

    const userId = req.userData.userId;

    try {

        const data = await User.findOne({_id: userId})
            .populate(
                {
                    path: 'carts -_id',
                    populate: {
                        path: 'product',
                        select: '_id name slug image price discountPercent availableQuantity author authorName categoryName subCatName publisherName companyName companySlug',
                        populate: {
                            path: 'priceData',
                            model: 'PriceDataExtra'
                        }
                    }
                }).select('carts')

        res.status(200).json({
            data: data && data.carts ? data.carts : [],
            message: 'All Products Fetched Successfully!'
        });
    } catch (err) {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


// exports.getCartItemByUserId = async (req, res, next) => {
//
//     const userId = req.userData.userId;
//
//     try {
//
//         // const cartsId = await User.findOne({_id: userId}).distinct('carts')
//         //
//         // const query = {_id: {$in: cartsId}}
//         // const allCarts = await Cart.find(query)
//         //     .populate('book', '_id name slug image price discountPercent availableQuantity author authorName');
//
//         const data = await User.findOne({_id: userId})
//             .populate({
//                 path: 'carts',
//                 populate: {
//                     path: 'book',
//                     model: 'Book',
//                     select: '_id name slug image price discountPercent availableQuantity author authorName companyName companySlug',
//                     populate: {
//                         path: 'priceData',
//                         model: 'PriceDataExtra'
//                     }
//                 }
//             }).select('carts')
//
//         res.status(200).json({
//             data: data,
//             message: 'All Product fetch Successfully!'
//         });
//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//             err.message = 'Something went wrong on database operation!'
//         }
//         next(err);
//     }
// }

exports.incrementCartQty = async (req, res, next) => {

    const cartId = req.body.cartId;

    try {
        await Cart.findOneAndUpdate(
            {_id: cartId},
            {$inc: {'selectedQty': 1}},
            {new: true}
        )
        res.status(200).json({
            message: 'Update cart quantity Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.decrementCartQty = async (req, res, next) => {

    const cartId = req.body.cartId;

    try {
        await Cart.findOneAndUpdate(
            {_id: cartId},
            {$inc: {'selectedQty': -1}},
            {new: true}
        )
        res.status(200).json({
            message: 'Update cart quantity Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.deleteCartItem = async (req, res, next) => {

    const cartId = req.params.cartId;
    const userId = req.userData.userId;

    try {
        const query = {_id: cartId}
        await Cart.deleteOne(query)

        // Remove Ref
        await User.updateOne(
            {_id: userId},
            {
                $pull: {carts: cartId}
            }
        )

        res.status(200).json({
            message: 'Cart removed Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }

}


exports.getCartItemCount = async (req, res, next) => {

    const userId = req.userData.userId;

    try {

        const cartsId = await User.findOne({_id: userId}).distinct('carts')

        res.status(200).json({
            data: cartsId.length
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getBookOnCartItem = async (req, res, next) => {
    const userId = req.userData.userId;
    const bookId = req.params.bookId;

    try {

        const data = await Cart.findOne({userId: userId, book: bookId}).select('selectedQty')

        res.status(200).json({
            data: data
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}
