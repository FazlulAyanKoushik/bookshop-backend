const express = require('express');

// Created Require Files..
const controller = require('../controller/book');
const inputValidator = require('../validation/book');
const checkAdminAuth = require('../middileware/check-admin-auth');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/book
 * http://localhost:3000/api/book
 */

router.post('/add-single-book-new', controller.addSingleBookNew);
router.post('/add-single-book', inputValidator.checkBookInput, controller.addSingleBook);
router.get('/get-all-book-list', controller.getAllBooks);
router.get('/get-single-book-by-slug/:slug', controller.getSingleBookBySlug);
router.get('/get-single-book-by-id/:id', controller.getSingleBookById);
// // Search
router.get('/get-books-by-text-search', controller.getSearchBookByText);
router.get('/get-books-by-regex-search', controller.getSearchBookByRegex);
router.get('/get-all-books-by-category/:id', controller.getAllBooksByCategory);
router.get('/get-all-books-by-author/:id', controller.getAllBooksByAuthor);
router.get('/get-all-books-by-publisher/:id', controller.getAllBooksByPublisher);
router.post('/get-from-collection-by-search', controller.getFromCollectionBySearch);
// Modify
router.post('/edit-book-by-id', inputValidator.checkBookInput, controller.updateBookData);
router.post('/update-book-data-field', controller.updateBookField);
router.delete('/delete-book-by-id/:id', controller.deleteBookById);
// Pre order Book
router.get('/get-pre-order-books', controller.getPreOrderBooksByLimit);
// Books by Query
router.post('/get-books-by-query', controller.getBooksByQuery);
router.post('/get-specific-books-by-id', controller.getSpecificBooksById);
router.get('/get-best-seller-books', controller.getBestSellerBooks);
// Filters
router.post('/get-books-by-filter-data', controller.filterByDynamicFilters);


// Export All router..
module.exports = router;
