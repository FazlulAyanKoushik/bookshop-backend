const express = require('express');

// Imports
const controller = require('../controller/sub-category');
const inputValidator = require('../validation/sub-category');
const checkAdminAuth = require('../middileware/check-admin-auth');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/sub-category
 * http://localhost:3000/api/sub-category
 */

router.post('/add-new-sub-category', controller.addNewSubCat);
router.get('/get-all-sub-category-list', controller.getAllSubCategory);
router.get('/get-sub-category-by-parent-cat/:id', controller.getSubCatsByParentCatId);
router.get('/get-sub-category-details-by-id/:id', controller.getASingleSubCategoryById);
router.get('/get-sub-category-seo-by-id/:id', controller.getASingleSubCategorySEOById);
router.get('/get-sub-category-details-by-slug/:slug', controller.getASingleSubCategoryBySlug);
router.delete('/delete-sub-category-by-id/:id', controller.deleteSubCategoryById);
router.post('/edit-sub-category-by-id/', controller.editSubCategoryData);
router.get('/get-sub-category-filter/:slug', controller.getSubCategoryFilter);
router.get('/get-sub-category-by-parent-slug/:slug', controller.getSubCatsByParentSlug);


// Export router class..
module.exports = router;

