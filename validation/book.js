const { body } = require('express-validator');

// For Admin..
exports.checkBookInput = [
    body('name').not().isEmpty().withMessage('Please enter a valid name!'),
    body('slug').not().isEmpty().withMessage('Please enter a valid slug!'),
];

