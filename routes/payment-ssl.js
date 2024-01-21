const express = require('express');

// Imports
const controller = require('../controller/payment-ssl');
const checkAuth = require('../middileware/check-user-auth');
// Get Express Router Function..
const router = express.Router();

/**
 * /api/payment-ssl
 * http://localhost:3000/api/payment-ssl
 */

router.post('/init', controller.init);
router.post('/validate', controller.validate);
router.post('/transaction-query-by-session-id', controller.transactionQueryBySessionId);
router.post('/transaction-query-by-transaction-id', controller.transactionQueryByTransactionId);
router.post('/ipn', controller.ipn);


// Export router class..
module.exports = router;
