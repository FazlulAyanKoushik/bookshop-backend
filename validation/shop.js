const { body } = require('express-validator');

exports.checkCarouselInput = [
    body('image').not().isEmpty().withMessage('image required!'),
    body('url').not().isEmpty().withMessage('url required!')
];

exports.checkOfferBannerInput = [
    body('label').not().isEmpty().withMessage('tag required!')
];
