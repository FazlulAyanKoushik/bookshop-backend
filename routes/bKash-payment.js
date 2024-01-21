// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/bkash-payment.js');

const router = express.Router();

/**
 * /bkash
 * http://localhost:3000/api/bkash/execute-payment/:paymentID
 */


 router.post('/create-payment', controller.createPayment);
 router.post('/execute-payment', controller.executePayment);
 router.get('/query-payment/:paymentID', controller.queryPayment);
 
 
// Export All router..
module.exports = router;