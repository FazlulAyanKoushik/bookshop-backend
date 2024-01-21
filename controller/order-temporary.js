
// Require Post Schema from Model..

const Order = require('../models/order');
const OrderTemp = require('../models/order-temporary');
const User = require("../models/user");
const Cart = require("../models/cart");
const Product = require("../models/product");

exports.placeTempOrder = async (req, res, next) => {

    try {

        const userId = req.userData.userId;
        const finalData = {...req.body, ...{user: userId}}
        const orderTemp = new OrderTemp(finalData);
        const orderTempSave = await orderTemp.save();

        // await User.updateOne({_id: user}, {$set: {carts: []}});
        // await User.updateOne({_id: user}, {$push: {orders: orderSave._id}});
        // await Cart.deleteMany({_id: req.body.carts})

        res.json({
            orderId: orderTempSave._id,
            message: 'Data added successfully',
        })

    } catch (err) {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.updateSessionKey = async (req, res, next) => {

    try {

        console.log(req.params);

        const tranId = req.params.tranId;
        const sessionkey = req.params.sessionkey;
        const tempOrder = await OrderTemp.updateOne({_id: tranId}, {$set: {sessionkey: sessionkey}});

        res.json({
            message: 'Session Key Updated Successfully!',
        })

    } catch (err) {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

// exports.moveOrderToMainByTranId = async (req, res, next) => {

//     try {

        

//         res.json({
//             orderId: orderSave._id,
//             message: 'Data added successfully',
//         })

//     } catch (err) {
//         // console.log(err)
//         if (!err.statusCode) {
//             err.statusCode = 500;
//             err.message = 'Something went wrong on database operation!'
//         }
//         next(err);
//     }
// }

