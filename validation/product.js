const { body } = require('express-validator');

// For Admin..
exports.checkProductInput = [
    body('productName').not().isEmpty().withMessage('Please enter a valid productName!'),
    body('slug').not().isEmpty().withMessage('Please enter a valid slug!'),
    body('salePrice').not().isEmpty().withMessage('Please enter a valid name!')
];

exports.checkAdminLoginInput = [
    body('username').not().isEmpty().withMessage('Please enter a valid username!'),
    body('password').trim().isLength({min: 5}).withMessage('Oops! Password must be longer.')
];

