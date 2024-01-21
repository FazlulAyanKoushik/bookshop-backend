// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/newsletter');

const router = express.Router();

/**
 * /newsletter
 * http://localhost:3000/api/newsletter
 */


router.post('/add-newsletter', controller.addNewsletter);
router.get('/get-all-newsletter', controller.getNewsletters);
router.put('/update-newsletter', controller.updateNewsletter);
router.delete('/delete-newsletter/:id', controller.deleteNewsletter);

// Export All router..
module.exports = router;
