const express = require('express');

// Imports
const controller = require('../controller/shop');
const inputValidator = require('../validation/shop');
const checkAdminAuth = require('../middileware/check-admin-auth');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/shop
 * http://localhost:3000/api/shop
 */

// Carousel
router.post('/add-new-carousel', inputValidator.checkCarouselInput, controller.addNewCarousel);
router.get('/get-all-carousel', controller.getAllCarousel);
router.get('/get-single-carousel/:id', controller.getSingleCarouselById);
router.post('/edit-carousel-by-id', controller.editCarouselById);
router.delete('/delete-carousel-by-id/:id', controller.deleteCarouselById);
// Offer Banner Slider
router.post('/add-new-offer-slider', controller.addNewOfferSlider);
router.get('/get-all-offer-slider', controller.getAllOfferSlider);
router.get('/get-single-offer-slider/:id', controller.getSingleOfferSliderById);
router.post('/edit-offer-slider-by-id', controller.editOfferSliderById);
router.delete('/delete-offer-slider-by-id/:id', controller.deleteOfferSliderById);
// Contact Info
router.post('/set-contact-info', controller.setContactInfo);
router.get('/get-contact-info', controller.getContactInfo);
// Offer Product
router.post('/add-new-offer-product', controller.addOfferProduct);
router.get('/get-all-offer-product', controller.getAllOfferProduct);
router.get('/get-query-offer-product/:slug', controller.getQueryOfferProduct);
router.delete('/delete-offer-product/:id', controller.deleteOfferProductById);
// Sale Tag
router.post('/add-new-sale-tag', controller.addSaleTag);
router.get('/get-all-sale-tag', controller.getAllSaleTag);
router.get('/get-single-sale-tag-with-book/:id', controller.getSingleSaleTagWithBook);
router.post('/edit-sale-tag-by-id', controller.editSaleTagById);
router.post('/add-product-on-sale-tag', controller.addOfferBookOnTag);
router.get('/get-all-sale-tag-with-books', controller.getAllSaleTagWithBook);
router.get('/get-all-sale-tag-with-books-limit', controller.getAllSaleTagWithBookLimit);
router.get('/get-all-sale-tag-with-books-limit-aggregate', controller.getAllSaleTagWithBookLimitAggregate);
router.delete('/delete-sale-tag/:id', controller.deleteSaleTagById);
router.post('/remove-sale-tag-product', controller.removeSaleTagProduct);
router.post('/edit-on-sale-product', controller.editOnSaleProduct);
// MENU
router.post('/add-new-menu', controller.addNewMenu);
router.get('/get-all-menu', controller.getAllMenu);
router.delete('/delete-menu-by-id/:id', controller.deleteMenuById);
router.post('/edit-menu-by-id', controller.editMenuById);
// SIDE MENU
router.post('/add-new-side-menu', controller.addNewSideMenu);
router.get('/get-all-side-menu', controller.getAllSideMenu);
router.delete('/delete-side-menu-by-id/:id', controller.deleteSideMenuById);
router.post('/edit-side-menu-by-id', controller.editSideMenuById);
// Filter
router.get('/get-category-filter-data/:id', controller.getCategoryFilterData);
router.get('/get-sub-category-filter-data/:id', controller.getSubCategoryFilterData);
router.get('/get-author-filter-data/:id', controller.getAuthorFilterData);
router.get('/get-publisher-filter-data/:id', controller.getPublisherFilterData);
// Country
router.post('/add-new-country', controller.addCountry);
router.get('/get-all-country', controller.getCountryData);
router.delete('/delete-country-by-id/:id', controller.deleteCountryById);
// Language
router.post('/add-new-language', controller.addLanguage);
router.get('/get-all-language', controller.getLanguageData);
router.delete('/delete-language-by-id/:id', controller.deleteLanguageById);
// Extra Price Data
router.post('/set-extra-price-info', controller.setExtraPriceInfo);
router.get('/get-extra-price-info', controller.getExtraPriceInfo);
router.put('/edit-extra-info', controller.editExtraInfo);
// Page Info
router.post('/add-page-info', checkAdminAuth, controller.addNewPageInfo);
router.get('/get-page-info/:slug', controller.getPageInfoBySlug);


// Export router class..
module.exports = router;
