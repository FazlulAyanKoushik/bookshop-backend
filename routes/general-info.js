// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/general-info');
const inputValidator = require('../validation/admin');
const checkAdminAuth = require('../middileware/check-admin-auth');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/general-info
 * http://localhost:3000/api/general-info
 */
router.get("/get-users-count", checkAdminAuth, controller.getUserCount);
router.get("/get-orders-count",checkAdminAuth,controller.getOrdersCount);
router.get("/get-profit-amount",checkAdminAuth,controller.getProfitAmount);
router.get("/get-books-count",checkAdminAuth,controller.getBookCount);

// Export All router..
module.exports = router;
