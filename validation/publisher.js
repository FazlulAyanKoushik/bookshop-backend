const { body } = require('express-validator');

exports.checkPublisherInput = [
    body('publisherName').not().isEmpty().withMessage('Please enter a valid publisherName!'),
    body('slug').not().isEmpty().withMessage('Please enter a valid slug!'),
];
