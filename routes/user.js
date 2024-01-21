// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/user');
const inputValidator = require('../validation/user');
const checkAuth = require('../middileware/check-user-auth');
const checkAdminAuth = require('../middileware/check-admin-auth');

const router = express.Router();

/**
 * /api/user
 * http://localhost:3000/api/user
 */


router.post('/registration', controller.userRegistrationDefault);
router.put('/login', controller.userLoginDefault);
router.post('/facebook-login', controller.userFacebookAuth);
router.get('/logged-in-user-data', checkAuth, controller.getLoginUserInfo);
router.put('/edit-logged-in-user-data', checkAuth, controller.editLoggedInUserData);
router.put('/edit-user-by-admin/:id', checkAdminAuth, controller.editUserByAdmin);
router.get('/get-user-all-info-by-admin/:id', controller.getUserDetailsInfoByAdmin);
router.get('/get-all-user-list', checkAdminAuth, controller.getUserLists);
router.get('/get-user-by-user-id/:userId', controller.getUserByUserId);
router.post('/phone-verification', checkAuth, controller.updatePhoneVerificationStatus);

router.get('/get-all-address', checkAuth, controller.getAllAddress);
router.post('/add-address', checkAuth, controller.addToAddress);
router.put('/edit-address/:addressId', checkAuth, controller.editAddress);
router.delete('/delete-address/:addressId', checkAuth, controller.deleteAddress);

router.get('/check-user-by-phone/:phoneNo', controller.checkUserByPhone)
router.post('/edit-password', controller.editPassword);
router.post('/update-password', checkAuth, controller.updatePassword);

// ADMIN
router.put('/edit-user-access/:id', controller.editUserAccess);
router.put('/update-user-cart', controller.deleteAllCartItem);

// Export All router..
module.exports = router;
