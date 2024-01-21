const { body } = require('express-validator');

exports.checkCategoryInput = [
    body('categoryName').not().isEmpty().withMessage('Please enter a valid categoryName!'),
    body('slug').not().isEmpty().withMessage('Please enter a valid slug!'),
];
