// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/review-control');
const checkAuth = require('../middileware/check-user-auth');
const checkAdminAuth = require('../middileware/check-admin-auth');

const router = express.Router();

/**
 * /brand
 * http://localhost:3000/api/review-control
 */

router.post('/add-review', checkAuth, controller.addReview);
router.post("/add-review-by-id/:id", checkAuth, controller.addReviewById);
router.post('/get-all-review-by-query', controller.getAllReviewsByQuery);
router.get('/get-all-review', controller.getAllReviews);
router.get("/get-all-reviews/:bookId", controller.getAllReviewsOfABook);
router.get('/get-review-by-review-id/:reviewId', controller.getReviewByReviewId);
router.put('/edit-review', controller.editReview);
router.delete('/delete-review-by-id/:reviewId', controller.deleteReviewByReviewId);

// Export All router..
module.exports = router;
