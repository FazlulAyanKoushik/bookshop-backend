const express = require('express');

// Imports
const controller = require('../controller/sub-category-product');
const checkAdminAuth = require('../middileware/check-admin-auth');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/sub-category-product
 * http://localhost:3000/api/sub-category-product
 */

// Carousel
router.post('/add-new-sub-category-product', controller.addSubCategoryProduct);
router.delete('/delete-sub-category-product/:id', controller.deleteSubCategoryProductById);
router.get('/get-all-sub-category-products', controller.getAllSubCategoryProducts);
router.get('/get-sub-category-product-by-id/:id', controller.getSingleSubCategoryProduct);
router.get('/get-sub-category-product-by-id-populate/:id', controller.getSingleSubCategoryProductPopulate);
router.put('/edit-sub-category-product-by-id', controller.editSubCategoryProduct);
router.post('/remove-sub-category-product', controller.removeSubCategoryProduct);
router.post('/edit-sub-category-product-priority', controller.editSubCategoryProductPriority);


module.exports = router;
