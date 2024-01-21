const express = require('express');

// Imports
const controller = require('../controller/checkout');
const checkAuth = require('../middileware/check-user-auth');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/checkout
 * http://localhost:3000/api/checkout
 */

router.post('/add-to-checkout', checkAuth, controller.addToCheckout);
router.get('/get-checkout-by-user', checkAuth, controller.getCheckoutItemByUserId);
router.get('/get-checkout-details/:id', checkAuth, controller.getCheckoutDetailsById);
// Admin Control
router.get('/get-checkout-lists', controller.getCheckoutList);



// Export router class..
module.exports = router;

