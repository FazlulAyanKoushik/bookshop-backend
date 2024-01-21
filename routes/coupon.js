// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/coupon');
const inputValidator = require('../validation/user');
const checkAuth = require('../middileware/check-user-auth');
const checkUserAuth = require('../middileware/check-user-auth');
const checkAdminAuth = require('../middileware/check-admin-auth');


const router = express.Router();

/**
 * /api/user
 * http://localhost:3000/api/coupon
 */

// use this to API to create new coupons while logged in as an admin
// {
//     "couponName": "15% Discount on pre-order books",
//     "couponAmount": 15,
//     "couponCode": "PRE15",
//     "couponStartDate": "3/19/2021",
//     "couponEndDate": "3/20/2021"
// }
// format of body data to be sent to this api
router.post('/add-coupon', checkAdminAuth, controller.addCoupon); // http://localhost:3000/api/coupon/add-coupon

router.get('/get-coupon-by-coupon-id/:couponId', controller.getCouponCouponId);



// use this API to edit coupons using coupon id, all fields of a coupon needs to be resent
// format of body data is the same as adding coupon
router.put('/edit-coupon', controller.editCouponData); // http://localhost:3000/api/coupon/edit-coupon/:couponId



// use this API to delete coupons with coupon id
router.delete('/delete-coupon-by-id/:couponId', controller.deleteCoupon); // http://localhost:3000/api/coupon/delete-coupon/:couponId



// use this API to get an array containing all the coupons
router.get('/get-all-coupons', controller.getAllCoupons); // http://localhost:3000/api/coupon/get-all-coupons



// use this API to get the value of couponId and couponValue during order calculations to adjust price
// {
//     "Id": "6053da7f70ea542dcce747c8",
//     "couponValue": 15,
//     "message": "Coupon Added Successfully To Order!"
// }
// returns data as the structure above if coupon can be used, otherwise returns values of 0 for both couponId and couponValue if coupon has been used or does not exist
router.get('/use-coupon/:couponCode', checkAuth, controller.useCoupon); // http://localhost:3000/api/coupon/use-coupon/:couponCode



// use this API only once the order has been confirmed and placed to add coupon useage information to both user and coupon collection with the couponCode like "PREORDER!%"
router.put('/coupon-used', checkAuth, controller.couponUsed); // http://localhost:3000/api/coupon/coupon-used/:couponCode

router.get('/get-new-user-coupon', checkAuth, controller.getNewUserCoupon); // http://localhost:3000/api/coupon/get-new-user-coupon

// Export router class..
module.exports = router;
