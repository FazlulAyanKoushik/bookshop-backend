// Require Main Modules..
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Require Post Schema from Model..
const Coupon = require('../models/coupon');
const User = require('../models/user');
const { isNull } = require('lodash');

/**
 * Add Coupon
 * Admin
 */

 exports.addCoupon = async (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const data = req.body;

    try {

        const coupon = new Coupon(data);
        const couponCheck = await Coupon.findOne({couponCode: coupon.couponCode});

        let message = "A coupon with the same code already exists!";

        if (couponCheck == null) {
            await coupon.save();
            message = "Added to Coupon Successfully!";
        }

        res.status(200).json({
            message: message
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


exports.getCouponCouponId = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const couponId = req.params.couponId;
    const coupon = await Coupon.findOne({_id: couponId});

    try {
        res.status(200).json({
            data: coupon,
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

/**
 * Edit Coupon
 * Admin
 */

 exports.editCouponData = async (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const bodyData = req.body;

    try {
        await Coupon.findOneAndUpdate({_id: bodyData._id},
            {"$set": bodyData}
        )

        res.status(200).json({
            message: 'Edited Coupon Successfully!'
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

/**
 * Delete Coupon
 * Admin
 */

exports.deleteCoupon = async (req, res, next) => {

    const couponId = req.params.couponId;
    await Coupon.deleteOne({_id: couponId})

    try {
        res.status(200).json({
            message: 'Deleted Coupon Successfully!'
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
 * Get All Coupon
 * Admin
 */

 exports.getAllCoupons = async (req, res, next) => {

    // return userlist as well

    try {

        const coupons = await Coupon.find();

        res.status(200).json({
            data: coupons
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getNewUserCoupon = async (req, res, next) => {

    // return userlist as well

    try {

        const coupons = await Coupon.findOne({couponName: 'new-user'});

        res.status(200).json({
            data: coupons
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
 * Use Coupon
 * User
 */

 exports.useCoupon = async (req, res, next) => {

    // check limit

    const couponCode = req.params.couponCode;
    const userId = req.userData.userId;
    let coupon;
    let message = "";

    try {

        const couponCheck = await Coupon.findOne({couponCode: couponCode});

        if(couponCheck != null){

            if (new Date() < couponCheck.couponEndDate) {

                if(couponCheck.couponLimit > couponCheck.couponUsedByUser.length){

                    if(!couponCheck.couponUsedByUser.includes(userId, 0)){

                        coupon = couponCheck;

                        message = 'Coupon Added Successfully To Order!';

                    } else {

                        message = 'This Coupon Has Already Been Used By You!';

                    }

                } else {

                    message = 'This Coupon Has Exceeded It\'s Limit';

                }

            } else {

                message = 'This Coupon Has Either Expired Or Hasn\'t Started Yet';

            }

        } else {

            message = 'Coupon Does Not Exist!'

        }

        res.status(200).json({
            data: coupon,
            message: message
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

/**
 * Update Coupon Info After Order Confirmation
 */

exports.couponUsed = async (req, res, next) => {

    const couponId = req.body.couponId;
    console.log(couponId);
    const userId = req.userData.userId;

    try {

        await Coupon.findOneAndUpdate({_id: couponId}, {
            "$push": {
                couponUsedByUser: userId
            }
        });

        const coupon = await Coupon.findOne({_id: couponId});

        await User.findOneAndUpdate({_id: userId}, {
            "$push": {
                usedCoupons: coupon._id
            }
        });

        res.status(200).json({
            message: 'Coupon Redeemed Successfully!'
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


//
