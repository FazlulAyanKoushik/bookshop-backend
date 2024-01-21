const express = require('express');

// Imports
const controller = require('../controller/url-shortener');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/author
 * http://localhost:3000/api/url-shortener
 */

router.post('/generate', controller.generateShortUrl);
router.get('/redirect', controller.redirectToUrl);


// Export router class..
module.exports = router;
