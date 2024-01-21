const express = require('express');

// Imports
const controller = require('../controller/publisher');
const inputValidator = require('../validation/publisher');
const checkAdminAuth = require('../middileware/check-admin-auth');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/publisher
 * http://localhost:3000/api/publisher
 */

router.post('/add-new-publisher', inputValidator.checkPublisherInput, controller.addNewPublisher);
router.get('/get-all-publisher-list', controller.getAllPublisher);
router.get('/get-publisher-details-by-id/:id', controller.getASinglePublisherById);
router.get('/get-publisher-seo-by-id/:id', controller.getASinglePublisherSEOById);
router.get('/get-publisher-details-by-slug/:slug', controller.getASinglePublisherBySlug);
router.delete('/delete-publisher-by-id/:id', controller.deletePublisherById);
router.post('/edit-publisher-by-id/', controller.editPublisherData);
router.get('/get-publisher-book-count-by-id/:id', controller.getPublisherBookCountById);


// Export router class..
module.exports = router;

