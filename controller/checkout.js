const {validationResult} = require('express-validator');

// Require Post Schema from Model..
const Cart = require('../models/cart');
const User = require('../models/user');
const Checkout = require('../models/checkout');

/**
 * Add To Cart
 * Get Category List
 * Get Single Category
 * Delete Category
 * Edit Category
 */

exports.addToCheckout = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const userId = req.userData.userId;
    const data =  req.body;
    const cartsId = data.cartProducts.map(m => m._id);

    try {
        const checkout = new Checkout(data);
        const checkoutRes = await checkout.save();

        await User.findOneAndUpdate({_id: userId}, {
            "$push": {
                checkouts: checkoutRes._id
            }
        })

        await Cart.deleteMany({_id: {$in: cartsId}})
        // Remove Ref
        await User.updateOne(
            {_id: userId},
            {$pullAll : { carts : cartsId } }
        )

        res.status(200).json({
            message: 'Placed your order successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getCheckoutItemByUserId = async (req, res, next) => {

    const userId = req.userData.userId;

    try {

        const checkoutsId = await User.findOne({_id: userId}).distinct('checkouts')

        const query = {_id: {$in: checkoutsId}}
        const allData = await Checkout.find(query)
            .select('cartProducts subTotal discount payable shippingFee paymentType createdAt deliveryStatus')

        res.status(200).json({
            data: allData,
            message: 'Checkout list fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getCheckoutDetailsById = async (req, res, next) => {

    const checkoutId = req.params.id;

    try {
        const query = {_id: checkoutId}
        const data = await Checkout.findOne(query)
            .select('-updatedAt')

        res.status(200).json({
            data: data,
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


/**
 * ADMIN CONTROL
 */

exports.getCheckoutList = async (req, res, next) => {

    try {
        const allData = await Checkout.find()
        res.status(200).json({
            data: allData,
            message: 'Checkout list fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}
