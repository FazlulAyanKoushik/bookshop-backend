const express = require('express');

const controller = require('../controller/order-temporary');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkAuth = require('../middileware/check-user-auth');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/order
 * http://localhost:3000/api/order
 */

// USER

router.post('/place-temp-order', checkAuth, controller.placeTempOrder);
router.post('/update-session-key/:tranId/:sessionkey', controller.updateSessionKey);
// router.post('/move-order-to-main-by-tran-id/:tranId', controller.moveOrderToMainByTranId);

// Export router class..
module.exports = router;