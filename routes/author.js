const express = require('express');

// Imports
const controller = require('../controller/author');
const inputValidator = require('../validation/author');
const checkAdminAuth = require('../middileware/check-admin-auth');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/author
 * http://localhost:3000/api/author
 */

router.post('/add-new-author', inputValidator.checkAuthorInput, controller.addNewAuthor);
router.get('/get-all-author-list', controller.getAllAuthors);
// router.get('/get-all-author-seo-list', controller.getAllAuthorsSeo);
router.get('/get-author-details-by-id/:id', controller.getASingleAuthorById);
router.get('/get-author-seo-by-id/:id', controller.getASingleAuthorSEOById);
router.get('/get-author-details-by-slug/:slug', controller.getASingleAuthorBySlug);
router.delete('/delete-author-by-id/:id', controller.deleteAuthorById);
router.post('/edit-author-by-id/', controller.editAuthorData);


// Export router class..
module.exports = router;
