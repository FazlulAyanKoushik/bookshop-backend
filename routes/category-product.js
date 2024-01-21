const express = require('express');

// Imports
const controller = require('../controller/category-product');
const checkAdminAuth = require('../middileware/check-admin-auth');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/category-product
 * http://localhost:3000/api/category-product
 */

// Carousel
router.post('/add-new-category-product', controller.addCategoryProduct);
router.delete('/delete-category-product/:id', controller.deleteCategoryProductById);
router.get('/get-all-category-products', controller.getAllCategoryProducts);
router.get('/get-category-product-by-id/:id', controller.getSingleCategoryProduct);
router.get('/get-category-product-by-id-populate/:id', controller.getSingleCategoryProductPopulate);
router.put('/edit-category-product-by-id', controller.editCategoryProduct);
router.post('/remove-category-product', controller.removeCategoryProduct);
router.post('/edit-category-product-priority', controller.editCategoryProductPriority);


module.exports = router;
