const express = require('express');

// Created Require Files..
const controller = require('../controller/bazaar');
// const inputValidator = require('../validation/product');
// const checkAuth = require('../middileware/check-user-auth');

// Get Express Router Function..
const router = express.Router();

router.post('/add-new-bazaar', controller.addBazaar); // http://localhost:3000/api/bazaar/add-new-bazaar
router.get('/get-all-bazaar-list', controller.getAllBazaar); // http://localhost:3000/api/bazaar/get-all-bazaar-list

// Export All router..
module.exports = router;
