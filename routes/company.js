const express = require('express');

// Imports
const controller = require('../controller/company');
const checkAdminAuth = require('../middileware/check-admin-auth');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/company
 * http://localhost:3000/api/company
 */

router.post('/add-new-company', controller.addNewCompany);
router.get('/get-all-company-list', controller.getAllCompany);
router.get('/get-company-details-by-id/:id', controller.getASingleCompanyById);
router.get('/get-company-details-by-slug/:slug', controller.getASingleCompanyBySlug);
router.delete('/delete-company-by-id/:id', controller.deleteCompanyById);
router.post('/edit-company-by-id/', controller.editCompanyData);
router.get('/get-company-book-count-by-id/:id', controller.getCompanyBookCountById);


// Export router class..
module.exports = router;

