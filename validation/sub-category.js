const { body } = require('express-validator');

exports.checkInput = [
    body('publisherName').not().isEmpty().withMessage('Please enter a valid publisherName!'),
    body('slug').not().isEmpty().withMessage('Please enter a valid slug!'),
];
