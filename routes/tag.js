const express = require('express');

// Imports
const controller = require('../controller/tag');
const inputValidator = require('../validation/author');
const checkAdminAuth = require('../middileware/check-admin-auth');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/tag
 * http://localhost:3000/api/tag
 */

 router.post('/add-single-tag', controller.addSingleTag);
 router.get('/get-all-tags', controller.getAllTags);
 router.post('/add-multiple-tag', controller.insertManyTag);
 router.get('/get-tag-by-tag-id/:tagId', controller.getTagByTagId);
 router.put('/edit-tag-by-tag', controller.editTagData);
 router.delete('/delete-tag-by-id/:tagId', controller.deleteTagByTagId);
 router.post('/get-tags-by-search', controller.getTagsBySearch);


// Export router class..
module.exports = router;
