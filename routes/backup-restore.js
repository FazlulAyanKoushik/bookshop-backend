const express = require('express');

// Created Require Files..
const controller = require('../controller/backup-restore');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/backup-restore
 * http://localhost:3000/api/backup-restore
 */
router.post('/collection-backup', controller.backupCollection);
router.post('/collection-restore', controller.restoreCollection);
router.get('/get-all-collections', controller.getCollectionList);

// Export All router..
module.exports = router;
