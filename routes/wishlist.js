const express = require('express');

// Imports
const controller = require('../controller/wishlist');
const checkAuth = require('../middileware/check-user-auth');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/wishlist
 * http://localhost:3000/api/wishlist
 */

router.post('/add-to-wishlist', checkAuth, controller.addToWishlist);
router.get('/get-wishlist-items-by-user', checkAuth, controller.getWishlistItemByUser);
router.get('/get-status-of-book-in-wishlist/:productId', checkAuth, controller.getStatusOfBookInWishlist);
router.delete('/delete-wishlist-by-id/:id', checkAuth, controller.removeWishlistById);
router.get('/get-wishlist-count-from-db', checkAuth, controller.getWishlistCountFromDB);

// Export router class..
module.exports = router;
