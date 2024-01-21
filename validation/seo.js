const { body } = require('express-validator');

exports.checkInput = [
    body('pageName').not().isEmpty().withMessage('Please enter a valid Page Name!'),
    body('metaTag').not().isEmpty().withMessage('Please enter a valid Meta Tag!'),
    body('keyword').not().isEmpty().withMessage('Please enter a valid Keyword!'),
];
