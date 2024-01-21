// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/contact-us');

const router = express.Router();

/**
 * /contact-us
 * http://localhost:3000/api/contact-us
 */

router.post('/add-contact-us', controller.addContactUs);
router.get('/get-all-contact-us', controller.getAllContactUs);
router.get('/get-contact-us-by-id/:id', controller.getContactUsById);
router.put('/edit-contact-us-by-id', controller.editContactUs);
router.delete('/delete-contact-us-by-id/:id', controller.deleteContactUsById);
// Node Mailer
router.post('/sent-mail-by-node-mailer', controller.sentMailByNodemailer);

// Export All router..
module.exports = router;
