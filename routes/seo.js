const express = require('express');

// Imports
const controller = require('../controller/seo');
const inputValidator = require('../validation/seo');
const checkAdminAuth = require('../middileware/check-admin-auth');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/sub-category
 * http://localhost:3000/api/seo
 */


 router.post('/add-new-seo', controller.addNewSEO);
 router.get('/get-all-seo-list', controller.getAllSEO);
 router.get('/get-single-author-seo', controller.getASingleAuthorSEO);
 router.get('/get-single-publisher-seo', controller.getASinglePublisherSEO);
 router.get('/get-single-contact-seo', controller.getASingleContactSEO);
 router.get('/get-single-about-seo', controller.getASingleAboutUsSEO);
 router.get('/get-seo-details-by-id/:id', controller.getASingleSEoById);
 router.get('/get-seo-details-by-slug/:slug', controller.getASingleSEOBySlug);
 router.delete('/delete-seo-by-id/:id', controller.deleteSEOById);
 router.post('/edit-seo-by-id/', controller.editSEOData);
//  router.get('/get-seo-filter/:slug', controller.getSeoFilter);
 
 
 // Export router class..
 module.exports = router;