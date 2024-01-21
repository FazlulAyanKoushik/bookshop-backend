const { body } = require('express-validator');

exports.checkAuthorInput = [
    body('authorName').not().isEmpty().withMessage('Please enter a valid authorName!'),
    body('slug').not().isEmpty().withMessage('Please enter a valid slug!'),
];
