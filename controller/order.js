
const ObjectId = require('mongoose').Types.ObjectId


// Require Post Schema from Model..

const Book = require('../models/book');
const Order = require('../models/order');
const OrderNew = require('../models/order-new');
const User = require("../models/user");
const Cart = require("../models/cart");
const Product = require("../models/product");
const enumObj = require('../helpers/enum-obj');
const Coupon = require('../models/coupon');
const UniqueId = require('../models/unique-id');
const Reward = require('../models/reward');
const Controller = require("../helpers/controller");
const {validationResult} = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

/**
 * NEW API
 * placeOrderV2()
 * getAllOrdersByUserV2()
 */


 exports.getOrderIdForBkash= async (req, res, next) => {

    try {

        // Increment Order Id Unique
        const incOrder = await UniqueId.findOneAndUpdate(
            {},
            {$inc: {orderId: 1}},
            {new: true, upsert: true}
        )
        const orderIdUnique = padLeadingZeros(incOrder.orderId);

        res.json({
            success: true,
            orderId: orderIdUnique,
            message: 'Order Id created successfully',
        })


        }
        catch (err) {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.placeOrderV2 = async (req, res, next) => {

    try {

        const {userId} = req.body;
        const {orderData} = req.body;
        const {registrationData} = req.body;

        let orderIdUnique;
        if (orderData.orderId) {
            orderIdUnique = orderData.orderId;
        } else {
            // Increment Order Id Unique
            const incOrder = await UniqueId.findOneAndUpdate(
                {},
                {$inc: {orderId: 1}},
                {new: true, upsert: true}
            )

            orderIdUnique = padLeadingZeros(incOrder.orderId);
        }


        if (userId) {
            // Log in User Place Order
            const finalData = {...orderData, ...{user: userId, orderId: orderIdUnique}}
            const order = new OrderNew(finalData);
            const orderSave = await order.save();

            let userQuery;

            // Update Reward Point
            if (orderData.isUseReward) {
                const {rewardPoints} = await User.findOne({_id: userId});
                const userRewardPoints = rewardPoints ? rewardPoints : 0;
                const newRewardPoints = userRewardPoints - orderData.usedRewardPoint;
                userQuery = {$set: {carts: [], rewardPoints: newRewardPoints}, $push: {orders: orderSave._id}}
            } else {
                userQuery = {$set: {carts: []}, $push: {orders: orderSave._id}}
            }

            // Coupon User By User
            if (orderData.couponId) {
                await Coupon.findByIdAndUpdate({_id: orderData.couponId}, {$push: {couponUsedByUser: userId}});
            }

            // UPDATE USER CARTS & CHECKOUT
            await User.findOneAndUpdate(
                {_id: userId},
                userQuery
            )

            await Cart.deleteMany({user: new ObjectId(userId)});

            res.json({
                success: true,
                token: null,
                expiredIn: null,
                orderId: orderSave._id,
                message: 'Order Placed successfully',
            })

        } else if (!userId && registrationData) {
            // Need to Registered New User & Place Order
            const userExists = await User.findOne({username: registrationData.phoneNo}).lean();

            if (userExists) {
                const error = new Error(`A user with this ${registrationData.phoneNo ? 'Phone' : 'Email'} no already registered!`);
                error.statusCode = 406;
                next(error);
            } else {
                const password = registrationData.password;
                const hashedPass = bcrypt.hashSync(password, 8);
                const regData = {...registrationData, ...{password: hashedPass}}
                const user = new User(regData);

                const newUser = await user.save();

                // Create Order
                const finalData = {...orderData, ...{user: null, orderId: orderIdUnique}}
                const order = new OrderNew(finalData);
                const orderSave = await order.save();

                const token = jwt.sign({
                        username: newUser.username,
                        userId: newUser._id
                    },
                    process.env.JWT_PRIVATE_KEY, {
                        expiresIn: '24h'
                    }
                );


                const userQuery = {$set: {carts: []}, $push: {orders: orderSave._id}}

                // UPDATE USER CARTS & CHECKOUT
                await User.findOneAndUpdate(
                    {_id: newUser._id},
                    userQuery
                )

                res.json({
                    success: true,
                    token: token,
                    expiredIn: 86400,
                    orderId: orderSave._id,
                    message: 'Order Placed successfully',
                })

            }

        } else if (!userId && !registrationData) {
            // Need Place Order without Registration
            const finalData = {...orderData, ...{user: null, orderId: orderIdUnique}}
            const order = new OrderNew(finalData);
            const orderSave = await order.save();

            res.json({
                success: true,
                token: null,
                expiredIn: null,
                orderId: orderSave._id,
                message: 'Order Placed successfully',
            })

        } else {
            res.json({
                success: false,
                orderId: null,
                message: 'Error! Can not place order',
            })
        }
    } catch (err) {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAllOrdersByUserV2 = async (req, res, next) => {
    try {

        const userId = req.userData.userId;

        let pageSize = req.query.pageSize;
        let currentPage = req.query.page;
        let select = req.query.select;

        let queryData;
        queryData = OrderNew.find({user: userId});
        let data;

        if (pageSize && currentPage) {
            queryData.skip(Number(pageSize) * (Number(currentPage) - 1)).limit(Number(pageSize))
        }

        data = await queryData.select(select ? select : '').sort({createdAt: -1});

        const dataCount = await OrderNew.countDocuments({user: userId});

        res.status(200).json({
            data: data,
            count: dataCount,
            message: 'Order get Successfully!'
        });
    } catch (err) {
        //console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getOrderDetailsByIdV2 = async (req, res, next) => {

    const orderId = req.params.id;

    try {
        const query = {_id: orderId}
        const data = await OrderNew.findOne(query)
            .select('-updatedAt -sessionkey -orderPaymentInfo')

        res.status(200).json({
            data: data,
            message: 'Success!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }

}

exports.getOrderDetailsByOrderIdV2 = async (req, res, next) => {

    const orderId = req.params.orderId;

    try {
        const query = {orderId: orderId}
        const data = await OrderNew.findOne(query)
            .select('-updatedAt -sessionkey -orderPaymentInfo')

        res.status(200).json({
            data: data,
            message: 'Success!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }

}

exports.cancelOrderByUserV2 = async (req, res, next) => {
    try {
        const orderId = req.params.orderId;
        let order = await OrderNew.findById(orderId);

        if (order.deliveryStatus === enumObj.Order.PENDING && order.paymentStatus === 'unpaid') {
            await OrderNew.findByIdAndUpdate(orderId, {
                $set: {deliveryStatus: enumObj.Order.CANCEL}
            })
            res.status(200).json({
                message: 'Order has been canceled',
                status: 1
            });
        } else {
            res.status(200).json({
                message: 'You can\'t cancel this order. Please contact with seller',
                status: 0
            });
        }

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getAllTransactionByUserV2 = async (req, res, next) => {
    try {

        const userId = req.userData.userId;

        let pageSize = req.query.pageSize;
        let currentPage = req.query.page;
        let select = req.query.select;

        let data;
        let queryData;
        queryData = OrderNew.find({
            $and: [
                { user: userId },
                {
                    $or: [
                        {deliveryStatus: enumObj.Order.DELIVERED},
                        {paymentStatus: 'paid'}
                    ]
                }
            ]
        });

        if (pageSize && currentPage) {
            queryData.skip(Number(pageSize) * (Number(currentPage) - 1)).limit(Number(pageSize))
        }

        data = await queryData.select(select ? select : '').sort({createdAt: -1});

        const dataCount = await Order.countDocuments({
            $and: [
                { user: userId },
                {
                    $or: [
                        {deliveryStatus: enumObj.Order.DELIVERED},
                        {paymentStatus: 'paid'}
                    ]
                }
            ]
        });

        res.status(200).json({
            data: data,
            count: dataCount,
            message: 'Transaction get Successfully!'
        });
    } catch (err) {
        //console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getSingleOrderByUserV2 = async (req, res, next) => {
    try {
        const order = await OrderNew.findById(req.params.orderId)
            .populate({
                path: 'orderedItems.product',
                model: 'Book',
                select: '_id name slug image price discountPercent availableQuantity author authorName categoryName',
            })

        res.json({
            data: order
        })
    } catch (error) {
        res.json({
            success: false,
            message: "Something went Wrong"
        })
        next(error);
    }
}

exports.getSingleOrderByAdminV2 = async (req, res, next) => {
    try {
        const order = await OrderNew.findById(req.params.orderId).populate({
            path: 'orderedItems.product',
            model: 'Book',
            select: '_id name slug image price discountPercent availableQuantity author authorName categoryName',
        });

        res.json({
            success: true,
            data: order
        })
    } catch (error) {
        res.json({
            success: false,
            message: "Somrthing went Wrong"
        })
        next(error);
    }
}

exports.getAllOrdersByAdminV2 = async (req, res, next) => {
    try {
        let pageSize = req.query.pageSize;
        let currentPage = req.query.page;
        let select = req.query.select;
        let query = req.body.query;

        let dataCount;
        let queryData;
        if (query) {
            queryData = OrderNew.find(query);
            dataCount = await OrderNew.countDocuments(query);
        } else {
            queryData = OrderNew.find();
            dataCount = await OrderNew.countDocuments();
        }
        let data;

        if (pageSize && currentPage) {
            queryData.skip(Number(pageSize) * (Number(currentPage) - 1)).limit(Number(pageSize))
        }

        data = await queryData.select(select ? select : '').sort({createdAt: -1});



        res.status(200).json({
            data: data,
            count: dataCount,
            message: 'Order get Successfully!'
        });
    } catch (err) {
        //console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}
exports.getAllTransactionByAdminV2 = async (req, res, next) => {
    try {

        let pageSize = req.query.pageSize;
        let currentPage = req.query.page;
        let select = req.query.select;

        let data;
        let queryData;
        queryData = OrderNew.find({
            $and: [
                {
                    $or: [
                        {deliveryStatus: enumObj.Order.DELIVERED},
                        {paymentStatus: 'paid'}
                    ]
                }
            ]
        });

        if (pageSize && currentPage) {
            queryData.skip(Number(pageSize) * (Number(currentPage) - 1)).limit(Number(pageSize))
        }

        data = await queryData.select(select ? select : '').sort({createdAt: -1});

        const dataCount = await OrderNew.countDocuments({
            $and: [
                {
                    $or: [
                        {deliveryStatus: enumObj.Order.DELIVERED},
                        {paymentStatus: 'paid'}
                    ]
                }
            ]
        });

        res.status(200).json({
            data: data,
            count: dataCount,
            message: 'Transaction get Successfully!'
        });
    } catch (err) {
        //console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}
exports.getUserOrdersByAminV2 = async (req, res, next) => {
    try {
        const order = await OrderNew.find({userId: req.params.userId});
        res.json({
            success: true,
            data: order
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAllCanceledOrdersByAdminV2 = async (req, res, next) => {
    try {
        const orders = await OrderNew.find({deliveryStatus: 6});
        res.json({
            success: true,
            data: orders
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }

}
exports.getAllOrdersByAdminNoPaginateV2 = async (req, res, next) => {
    try {

        const order = await OrderNew.find();
        const message = "Successfully retrieved orders";

        res.status(200).json({
            data: order,
            message: message
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }

}

exports.changeDeliveryStatusV2 = async (req, res, next) => {
    try {


        // NEW
        const deliveryStatus = req.body.deliveryStatus;
        console.log('deliveryStatus: ',deliveryStatus);

        const order = await OrderNew.findOne({_id: req.body._id}).populate('user');

        const smsData = {
            phoneNo: order.phoneNo,
            sms: '',
        }

        let updatePhase;

        switch(deliveryStatus) {
            case enumObj.Order.CONFIRM:
                updatePhase = 'orderTimeline.orderPlaced';
                updatePhaseDate = 'orderTimeline.orderPlacedDate';
                nextUpdatePhaseDate = 'orderTimeline.orderProcessingDate';
                smsData.sms = `Dear ${order.name}, Your order ${order.orderId ? order.orderId : order._id} is confirmed. Thank you for shopping at www.ehsan.com.bd.`;
                break;
            case enumObj.Order.PROCESSING:
                updatePhase = "orderTimeline.orderProcessing";
                updatePhaseDate = 'orderTimeline.orderProcessingDate';
                nextUpdatePhaseDate = 'orderTimeline.orderPickedByDeliveryManDate';
                smsData.sms = `Dear ${order.name}, We have started processing your order ${order.orderId ? order.orderId : order._id}. Thank you for shopping at www.ehsan.com.bd.`;
                break;
            case enumObj.Order.SHIPPING:
                updatePhase = 'orderTimeline.orderPickedByDeliveryMan';
                updatePhaseDate = 'orderTimeline.orderPickedByDeliveryManDate';
                nextUpdatePhaseDate = 'orderTimeline.orderDeliveredDate';
                smsData.sms = `Dear ${order.name}, We have handed over your order ${order.orderId ? order.orderId : order._id} to our delivery partner. Your product will be delivered soon. Thank you for shopping at www.ehsan.com.bd`;
                break;
            case enumObj.Order.DELIVERED:
                updatePhase = "orderTimeline.orderDelivered";
                updatePhaseDate = 'orderTimeline.orderDeliveredDate';
                nextUpdatePhaseDate = 'orderTimeline.othersDate';
                smsData.sms = `Dear ${order.name}, Your order ${order.orderId ? order.orderId : order._id} is now delivered. Thank you for shopping at www.ehsan.com.bd.`;
                break;
            case enumObj.Order.CANCEL:
                updatePhase = "orderTimeline.others";
                updatePhaseDate = 'orderTimeline.othersDate';
                nextUpdatePhaseDate = 'orderTimeline.othersDate';
                smsData.sms = `Dear ${order.name}, Your order ${order.orderId ? order.orderId : order._id} is canceled. Please order again at www.ehsan.com.bd.`;
                break;
            case enumObj.Order.REFUND:
                updatePhase = "orderTimeline.others";
                updatePhaseDate = 'orderTimeline.othersDate';
                nextUpdatePhaseDate = 'orderTimeline.othersDate';
                smsData.sms = `Dear ${order.name}, Your order ${order.orderId ? order.orderId : order._id} valued BDT ${order.totalAmount} is refunded to your account. The refund will take some days to reflect on your account statement. Thank you for shopping at www.ehsan.com.bd`;
                break;
            default:
                updatePhase = "orderTimeline.others";
                updatePhaseDate = 'orderTimeline.othersDate';
                nextUpdatePhaseDate = 'orderTimeline.othersDate';
                smsData.sms = 'Dear ' + order.name + ', your order no. ' + req.body._id + ' has changed in status on ' + req.body.updateDate + "please log into your account and check your order details. Ehsan.";

        }

        const updateDate = req.body.updateDate;
        const nextPhaseDate = req.body.nextPhaseDate;
        console.log('updateDate:',updateDate);
        console.log('nextPhaseDate:',nextPhaseDate);
        await OrderNew.findOneAndUpdate({_id: req.body._id}, {
            "$set":
                {
                    [updatePhase]: true,
                    [updatePhaseDate]: updateDate,
                    [nextUpdatePhaseDate]: nextPhaseDate,
                    "deliveryStatus": deliveryStatus
                }
        });
        

        /**
         * SMS SENT SSL
         */
         Controller.sendBulkSms(
            smsData.phoneNo,
            smsData.sms
        )

        if(req.body.deliveryStatus === enumObj.Order.CANCEL){
            // //console.log(req.body);
            // //console.log(req.body._id);
            const user = await OrderNew.findOne({_id: req.body._id});
            // //console.log(userId);
            let userId = await User.find({_id: user.user});
            let userRewardPoints = userId[0].rewardPoints ? userRewardPoints : 0;


            const order = await OrderNew.findOne({_id: req.body._id});

            await User.findOneAndUpdate(
                {_id: userId},
                {rewardPoints: userRewardPoints + (order.useReward ? order.useReward : 0)}
            )

            // //console.log(order.rewardPoint);
            // let useRewar = order.
        }

        if (req.body.deliveryStatus === enumObj.Order.DELIVERED) {
            await OrderNew.findOneAndUpdate({_id: req.body._id}, {$set: {paymentStatus: 'paid'}});
            const order = await OrderNew.findOne({_id: req.body._id});

            // if (order.orderedItems && order.orderedItems.length) {
            //     order.orderedItems.forEach(item => {
            //         Product.updateOne({_id: item.product}, {$inc: {soldQuantity: item.quantity}}).exec()
            //     });
            // }

            // reward
            const rewardData =  await Reward.findOne();
            const rewardPoint = Math.floor((rewardData.point / rewardData.purchaseAmount) * order.subTotal);

            const userData = await User.findOne({_id: order.user});
            const userRewardPoints = userData.rewardPoints ? userData.rewardPoints : 0;
            const finalRewards = userRewardPoints + rewardPoint;
            await User.findOneAndUpdate({_id: order.user},
                {
                "$set": {"rewardPoints":finalRewards}
            },
                {
                    upsert: true,
                    new: true
                }
            );

        }

        res.json({
            message: "Order status updated",
        })
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.deleteOrderByAdminV2 = async (req, res, next) => {
    try {
        const order = await OrderNew.findById(req.params.orderId);
        const userId = order.userId;

        await User.updateOne(
            {_id: userId},
            {
                $pull: {orders: order._id}
            }
        )

        await OrderNew.findByIdAndDelete(req.params.orderId);

        res.json({
            message: "Order is deleted"
        })


    } catch (err) {
        // //console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.filterByDynamicFiltersV2 = async (req, res, next) => {

    try {
        let limit = req.body.limit;
        const deliveryStatus = req.query.deliveryStatus;

        // const parent = req.body.parent;
        const queryData = await OrderNew.find({deliveryStatus: deliveryStatus})

        if (limit && limit.pageSize && limit.currentPage) {
            queryData.skip(limit.pageSize * (limit.currentPage - 1)).limit(limit.pageSize)
        }

        const dataCount = await OrderNew.countDocuments({deliveryStatus: deliveryStatus});

        const data = await queryData;

        res.status(200).json({
            data: data,
            count: dataCount
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.filterByDateRangeV2 = async (req, res, next) => {

    try {
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        const queryData = await OrderNew.find({checkoutDate: { "$gte": startDate, "$lte": endDate }})

        if (limit && limit.pageSize && limit.currentPage) {
            queryData.skip(limit.pageSize * (limit.currentPage - 1)).limit(limit.pageSize)
        }

        const dataCount = await OrderNew.countDocuments({deliveryStatus: query});

        const data = await queryData;

        res.status(200).json({
            data: data,
            count: dataCount
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}
exports.updateSingleOrderByIdV2 = async(req,res,next)=>{
    //console.log("In Order")
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const updatedData = req.body;
    //console.log(req.body);
    //console.log("---------------------------------------------------------------");
    
    const query = {_id: updatedData._id}
    const push = { $set: updatedData }

    OrderNew.findOneAndUpdate(query, push)
    .then(()=>{
       // //console.log(newOrder);
        res.status(200).json({
            message: 'Order Updated Success!'
        });
    })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

}


exports.allOrderGroupByPublisherV2 = async (req, res, next) => {

    try {
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;


        const data = await OrderNew.aggregate([
            {
                $match : { "checkoutDate": { $gte: startDate, $lte: endDate } }
            },
            {
                $project: {
                    name: 1,
                    phoneNo: 1,
                    grandTotal: 1,
                    checkoutDate: 1,
                    orderedItems: 1,
                    createdAt: 1
                }
            },
            {
                $unwind: "$orderedItems"
            },
            {
                $group: {
                    _id: '$orderedItems.publisher',
                    // grandTotal: { $first: '$grandTotal' },
                    orderedItems: {
                        $push: '$orderedItems'
                    }
                }
            },
            // {
            //     $group: {
            //         _id: '$orderedItems.publisher',
            //         items: {
            //             $push: '$$ROOT'
            //         }
            //     }
            // },
            {
                $sort : { createdAt: -1 }
            },
        ])

        // const queryData = await OrderNew.find({checkoutDate: { "$gte": startDate, "$lte": endDate }})
        //     .select('-orderTimeline')
        //
        // const dataCount = await OrderNew.countDocuments({checkoutDate: { "$gte": startDate, "$lte": endDate }});
        //
        // const data = await queryData;

        res.status(200).json({
            data: data,
            count: data.length
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
 * Add To ORDER
 * GET ORDER LIST
 */

exports.placeOrder = async (req, res, next) => {

    try {

        const userId = req.userData.userId;

        // Increment Order Id Unique
        const incOrder = await UniqueId.findOneAndUpdate(
            {},
            { $inc: { orderId: 1 } },
            {new: true, upsert: true}
        )

        const orderIdUnique = padLeadingZeros(incOrder.orderId);

        const finalData = {...req.body, ...{user: userId, orderId: orderIdUnique}}
        const order = new Order(finalData);
        const orderSave = await order.save();

        // let userRewardPoints = User.find({_id: userId}).rewardPoints;
        let user = await User.findOne({_id: userId});
        let userRewardPoints = user.rewardPoints ? user.rewardPoints : 0;

        if (req.body.couponId) {
            await Coupon.findByIdAndUpdate({_id: req.body.couponId}, {$push: {couponUsedByUser: userId}});
        }

        let userQuery;

        if (order.isRewardPoint) {
            if (req.body.couponId) {
                userQuery = {$set: {carts: [], rewardPoints: userRewardPoints - req.body.useReward}, $push: {checkouts: orderSave._id, usedCoupons: req.body.couponId}}
            } else {
                userQuery = {$set: {carts: [], rewardPoints: userRewardPoints - req.body.useReward}, $push: {checkouts: orderSave._id}}
            }
        } else {
            if (req.body.couponId) {
                userQuery = {$set: {carts: []}, $push: {checkouts: orderSave._id, usedCoupons: req.body.couponId}}
            } else {
                userQuery = {$set: {carts: []}, $push: {checkouts: orderSave._id}}
            }
        }

        // UPDATE USER CARTS & CHECKOUT
        await User.findOneAndUpdate(
            {_id: userId},
            userQuery
        )

        await Cart.deleteMany({user: new ObjectId(userId)});

        res.json({
            orderId: orderSave._id,
            message: 'Order Placed successfully',
        })

    } catch (err) {
        //console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

// exports.getAllOrdersByUser = async (req, res, next) => {
//     try {
//         const orders = await User.findById(req.userData.userId)
//             .populate('checkouts')
//             .select('checkouts -_id');
//
//         res.json({
//             data: orders ? orders.orders : orders
//         })
//
//     } catch (error) {
//         res.json({
//             success: false,
//             errorMsg: error.message,
//             message: "Something went Wrong"
//         })
//         next(error);
//     }
// }

exports.getAllOrdersByUser = async (req, res, next) => {
    try {

        const userId = req.userData.userId;

        let pageSize = req.query.pageSize;
        let currentPage = req.query.page;
        let select = req.query.select;

        let queryData;
        queryData = Order.find({user: userId});
        let data;

        if (pageSize && currentPage) {
            queryData.skip(Number(pageSize) * (Number(currentPage) - 1)).limit(Number(pageSize))
        }

        data = await queryData.select(select ? select : '').sort({createdAt: -1});

        const dataCount = await Order.countDocuments({user: userId});

        res.status(200).json({
            data: data,
            count: dataCount,
            message: 'Order get Successfully!'
        });
    } catch (err) {
        //console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getOrderDetailsById = async (req, res, next) => {

    const orderId = req.params.id;

    try {
        const query = {_id: orderId}
        const data = await Order.findOne(query)
            .select('-updatedAt -sessionkey -orderPaymentInfo')
            .populate(
                {
                    path: 'orderedItems.product',
                    model: 'Book'
                },
              
            )

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

exports.cancelOrderByUser = async (req, res, next) => {
    try {
        const orderId = req.params.orderId;
        let order = await Order.findById(orderId);

        if (order.deliveryStatus === enumObj.Order.PENDING && order.paymentStatus === 'unpaid') {
            order.deliveryStatus = enumObj.Order.CANCEL;
            await order.save();

            res.status(200).json({
                message: 'Order has been canceled',
                status: 1
            });
        } else {
            res.status(200).json({
                message: 'You can\'t cancel this order. Please contact with seller',
                status: 0
            });
        }

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAllTransactionByUser = async (req, res, next) => {
    try {

        const userId = req.userData.userId;

        let pageSize = req.query.pageSize;
        let currentPage = req.query.page;
        let select = req.query.select;

        let data;
        let queryData;
        queryData = Order.find({
            $and: [
                { user: userId },
                {
                    $or: [
                        {deliveryStatus: enumObj.Order.DELIVERED},
                        {paymentStatus: 'paid'}
                    ]
                }
            ]
        });

        if (pageSize && currentPage) {
            queryData.skip(Number(pageSize) * (Number(currentPage) - 1)).limit(Number(pageSize))
        }

        data = await queryData.select(select ? select : '').sort({createdAt: -1});

        const dataCount = await Order.countDocuments({
            $and: [
                { user: userId },
                {
                    $or: [
                        {deliveryStatus: enumObj.Order.DELIVERED},
                        {paymentStatus: 'paid'}
                    ]
                }
            ]
        });

        res.status(200).json({
            data: data,
            count: dataCount,
            message: 'Transaction get Successfully!'
        });
    } catch (err) {
        //console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}



exports.getAllOrdersByAdmin = async (req, res, next) => {
    try {
        let pageSize = req.query.pageSize;
        let currentPage = req.query.page;
        let select = req.query.select;
        let query = req.body.query;

        let dataCount;
        let queryData;
        if (query) {
            queryData = Order.find(query);
            dataCount = await Order.countDocuments(query);
        } else {
            queryData = Order.find();
            dataCount = await Order.countDocuments();
        }
        let data;

        if (pageSize && currentPage) {
            queryData.skip(Number(pageSize) * (Number(currentPage) - 1)).limit(Number(pageSize))
        }

        data = await queryData.select(select ? select : '').sort({createdAt: -1});



        res.status(200).json({
            data: data,
            count: dataCount,
            message: 'Order get Successfully!'
        });
    } catch (err) {
        //console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAllTransactionByAdmin = async (req, res, next) => {
    try {

        let pageSize = req.query.pageSize;
        let currentPage = req.query.page;
        let select = req.query.select;

        let data;
        let queryData;
        queryData = Order.find({
            $and: [
                {
                    $or: [
                        {deliveryStatus: enumObj.Order.DELIVERED},
                        {paymentStatus: 'paid'}
                    ]
                }
            ]
        });

        if (pageSize && currentPage) {
            queryData.skip(Number(pageSize) * (Number(currentPage) - 1)).limit(Number(pageSize))
        }

        data = await queryData.select(select ? select : '').sort({createdAt: -1});

        const dataCount = await Order.countDocuments({
            $and: [
                {
                    $or: [
                        {deliveryStatus: enumObj.Order.DELIVERED},
                        {paymentStatus: 'paid'}
                    ]
                }
            ]
        });

        res.status(200).json({
            data: data,
            count: dataCount,
            message: 'Transaction get Successfully!'
        });
    } catch (err) {
        //console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getSingleOrderByUser = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.orderId)
            .populate({
                path: 'orderedItems.product',
                model: 'Book',
                select: '_id name slug image price discountPercent availableQuantity author authorName categoryName',
            })

        res.json({
            data: order
        })
    } catch (error) {
        res.json({
            success: false,
            message: "Something went Wrong"
        })
        next(error);
    }
}

exports.getSingleOrderByAdmin = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.orderId).populate({
            path: 'orderedItems.product',
            model: 'Book',
            select: '_id name slug image price discountPercent availableQuantity author authorName categoryName',
        });

        res.json({
            success: true,
            data: order
        })
    } catch (error) {
        res.json({
            success: false,
            message: "Somrthing went Wrong"
        })
        next(error);
    }
}


exports.getUserOrdersByAmin = async (req, res, next) => {
    try {
        const order = await Order.find({userId: req.params.userId});
        res.json({
            success: true,
            data: order
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.deleteOrderByAdmin = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.orderId);
        const userId = order.userId;

        await User.updateOne(
            {_id: userId},
            {
                $pull: {orders: order._id}
            }
        )

        await Order.findByIdAndDelete(req.params.orderId);

        res.json({
            message: "Order is deleted"
        })


    } catch (err) {
        // //console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAllCanceledOrdersByAdmin = async (req, res, next) => {
    try {
        const orders = await Order.find({deliveryStatus: 6});
        res.json({
            success: true,
            data: orders
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }

}

exports.getAllOrdersByAdminNoPaginate = async (req, res, next) => {
    try {

        const order = await Order.find();
        const message = "Successfully retrieved orders";

        res.status(200).json({
            data: order,
            message: message
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }

}

exports.changeDeliveryStatus = async (req, res, next) => {
    try {


        // NEW
        const deliveryStatus = req.body.deliveryStatus;
        console.log('deliveryStatus: ',deliveryStatus);

        const order = await Order.findOne({_id: req.body._id}).populate('user');

        const smsData = {
            phoneNo: order.phoneNo,
            sms: '',
        }

        let updatePhase;

        switch(deliveryStatus) {
            case enumObj.Order.CONFIRM:
                updatePhase = 'orderTimeline.orderPlaced';
                updatePhaseDate = 'orderTimeline.orderPlacedDate';
                nextUpdatePhaseDate = 'orderTimeline.orderProcessingDate';
                smsData.sms = `Dear ${order.name}, Your order ${order.orderId ? order.orderId : order._id} is confirmed. Thank you for shopping at www.ehsan.com.bd.`;
                break;
            case enumObj.Order.PROCESSING:
                updatePhase = "orderTimeline.orderProcessing";
                updatePhaseDate = 'orderTimeline.orderProcessingDate';
                nextUpdatePhaseDate = 'orderTimeline.orderPickedByDeliveryManDate';
                smsData.sms = `Dear ${order.name}, We have started processing your order ${order.orderId ? order.orderId : order._id}. Thank you for shopping at www.ehsan.com.bd.`;
                break;
            case enumObj.Order.SHIPPING:
                updatePhase = 'orderTimeline.orderPickedByDeliveryMan';
                updatePhaseDate = 'orderTimeline.orderPickedByDeliveryManDate';
                nextUpdatePhaseDate = 'orderTimeline.orderDeliveredDate';
                smsData.sms = `Dear ${order.name}, We have handed over your order ${order.orderId ? order.orderId : order._id} to our delivery partner. Your product will be delivered soon. Thank you for shopping at www.ehsan.com.bd`;
                break;
            case enumObj.Order.DELIVERED:
                updatePhase = "orderTimeline.orderDelivered";
                updatePhaseDate = 'orderTimeline.orderDeliveredDate';
                nextUpdatePhaseDate = 'orderTimeline.othersDate';
                smsData.sms = `Dear ${order.name}, Your order ${order.orderId ? order.orderId : order._id} is now delivered. Thank you for shopping at www.ehsan.com.bd.`;
                break;
            case enumObj.Order.CANCEL:
                updatePhase = "orderTimeline.others";
                updatePhaseDate = 'orderTimeline.othersDate';
                nextUpdatePhaseDate = 'orderTimeline.othersDate';
                smsData.sms = `Dear ${order.name}, Your order ${order.orderId ? order.orderId : order._id} is canceled. Please order again at www.ehsan.com.bd.`;
                break;
            case enumObj.Order.REFUND:
                updatePhase = "orderTimeline.others";
                updatePhaseDate = 'orderTimeline.othersDate';
                nextUpdatePhaseDate = 'orderTimeline.othersDate';
                smsData.sms = `Dear ${order.name}, Your order ${order.orderId ? order.orderId : order._id} valued BDT ${order.totalAmount} is refunded to your account. The refund will take some days to reflect on your account statement. Thank you for shopping at www.ehsan.com.bd`;
                break;
            default:
                updatePhase = "orderTimeline.others";
                updatePhaseDate = 'orderTimeline.othersDate';
                nextUpdatePhaseDate = 'orderTimeline.othersDate';
                smsData.sms = 'Dear ' + order.name + ', your order no. ' + req.body._id + ' has changed in status on ' + req.body.updateDate + "please log into your account and check your order details. Ehsan.";

        }

        const updateDate = req.body.updateDate;
        const nextPhaseDate = req.body.nextPhaseDate;
        console.log('updateDate:',updateDate);
        console.log('nextPhaseDate:',nextPhaseDate);
        await Order.findOneAndUpdate({_id: req.body._id}, {
            "$set":
                {
                    [updatePhase]: true,
                    [updatePhaseDate]: updateDate,
                    [nextUpdatePhaseDate]: nextPhaseDate,
                    "deliveryStatus": deliveryStatus
                }
        });
        

        /**
         * SMS SENT SSL
         */
         Controller.sendBulkSms(
            smsData.phoneNo,
            smsData.sms
        )

        if(req.body.deliveryStatus === enumObj.Order.CANCEL){
            // //console.log(req.body);
            // //console.log(req.body._id);
            const user = await Order.findOne({_id: req.body._id});
            // //console.log(userId);
            let userId = await User.find({_id: user.user});
            let userRewardPoints = userId[0].rewardPoints ? userRewardPoints : 0;


            const order = await Order.findOne({_id: req.body._id});

            await User.findOneAndUpdate(
                {_id: userId},
                {rewardPoints: userRewardPoints + (order.useReward ? order.useReward : 0)}
            )

            // //console.log(order.rewardPoint);
            // let useRewar = order.
        }

        if (req.body.deliveryStatus === enumObj.Order.DELIVERED) {
            await Order.findOneAndUpdate({_id: req.body._id}, {$set: {paymentStatus: 'paid'}});
            const order = await Order.findOne({_id: req.body._id});

            // if (order.orderedItems && order.orderedItems.length) {
            //     order.orderedItems.forEach(item => {
            //         Product.updateOne({_id: item.product}, {$inc: {soldQuantity: item.quantity}}).exec()
            //     });
            // }

            // reward
            const rewardData =  await Reward.findOne();
            const rewardPoint = Math.floor((rewardData.point / rewardData.purchaseAmount) * order.subTotal);

            const userData = await User.findOne({_id: order.user});
            const userRewardPoints = userData.rewardPoints ? userData.rewardPoints : 0;
            const finalRewards = userRewardPoints + rewardPoint;
            await User.findOneAndUpdate({_id: order.user},
                {
                "$set": {"rewardPoints":finalRewards}
            },
                {
                    upsert: true,
                    new: true
                }
            );

        }

        res.json({
            message: "Order status updated",
        })
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.filterByDynamicFilters = async (req, res, next) => {

    try {
        let limit = req.body.limit;
        const deliveryStatus = req.query.deliveryStatus;

        // const parent = req.body.parent;
        const queryData = await Order.find({deliveryStatus: deliveryStatus})

        if (limit && limit.pageSize && limit.currentPage) {
            queryData.skip(limit.pageSize * (limit.currentPage - 1)).limit(limit.pageSize)
        }

        const dataCount = await Order.countDocuments({deliveryStatus: deliveryStatus});

        const data = await queryData;

        res.status(200).json({
            data: data,
            count: dataCount
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.filterByDateRange = async (req, res, next) => {

    try {
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        const queryData = await Order.find({checkoutDate: { "$gte": startDate, "$lte": endDate }})

        if (limit && limit.pageSize && limit.currentPage) {
            queryData.skip(limit.pageSize * (limit.currentPage - 1)).limit(limit.pageSize)
        }

        const dataCount = await Order.countDocuments({deliveryStatus: query});

        const data = await queryData;

        res.status(200).json({
            data: data,
            count: dataCount
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.updateSingleOrderById = async(req,res,next)=>{
    //console.log("In Order")
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const updatedData = req.body;
    //console.log(req.body);
    //console.log("---------------------------------------------------------------");
    
    const query = {_id: updatedData._id}
    const push = { $set: updatedData }

    Order.findOneAndUpdate(query, push)
    .then(()=>{
       // //console.log(newOrder);
        res.status(200).json({
            message: 'Order Updated Success!'
        });
    })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

}

function padLeadingZeros(num) {
    return String(num).padStart(4, '0');
}

