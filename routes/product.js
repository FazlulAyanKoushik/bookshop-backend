const express = require('express');

// Created Require Files..
const controller = require('../controller/product');
const inputValidator = require('../validation/product');
const checkAuth = require('../middileware/check-user-auth');

// Get Express Router Function..
const router = express.Router();

router.post('/add-single-product', controller.addSingleProduct); // http://localhost:3000/api/product/add-single-product
router.post('/add-bulk-product', controller.addManyProducts); // http://localhost:3000/api/product/add-bulk-product
router.get('/get-all-product-list', controller.getAllProducts); // http://localhost:3000/api/product/get-all-product-list
router.get('/get-single-product-by-slug/:slug', controller.getProductBySlug); // http://localhost:3000/api/product/get-product-by-slug/:slug
router.get('/get-single-product-by-id/:productId', controller.getProductById); // http://localhost:3000/api/product/get-product-by-id/:id
router.get('/get-product-list-by-category/:slug', controller.getProductsByCategory); // http://localhost:3000/api/product/get-product-by-category/:slug
router.get('/get-product-list-by-bazaar/:slug', controller.getProductsByBazaar); // http://localhost:3000/api/product/get-product-by-bazaar/:slug
// Search
router.get('/get-products-by-text-search', controller.getSearchProductByText); // http://localhost:3000/api/product/get-product-by-id/:id
// Modify
router.post('/edit-products-by-id', controller.editProductData); // http://localhost:3000/api/product/get-product-by-id/:id
router.post('/delete-products-by-id', controller.deleteProductById); // http://localhost:3000/api/product/get-product-by-id/:id

// Export All router..
module.exports = router;
