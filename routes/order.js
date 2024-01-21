const express = require('express');

// Imports
const controller = require('../controller/order');
const checkAuth = require('../middileware/check-user-auth');
const checkAdminAuth = require('../middileware/check-admin-auth');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/order
 * http://localhost:3000/api/order
 */

// USER

router.get('/v2/get-orderid-for-bkash', controller.getOrderIdForBkash);
router.post('/v2/place-order', controller.placeOrderV2);
router.get('/v2/get-all-orders-by-user', checkAuth, controller.getAllOrdersByUserV2);
router.get('/v2/get-order-details/:id', controller.getOrderDetailsByIdV2);
router.put('/v2/cancel-order-by-user/:orderId', checkAuth, controller.cancelOrderByUserV2);
router.get('/v2/get-all-transactions-by-user', checkAuth, controller.getAllTransactionByUserV2);
router.get("/v2/get-single-order-by-user/:orderId", checkAuth, controller.getSingleOrderByUserV2);
router.get("/v2/get-single-order-by-user-admin/:orderId", checkAdminAuth, controller.getSingleOrderByUserV2);
router.get('/v2/get-order-details-by-order-id/:orderId', controller.getOrderDetailsByOrderIdV2);


router.post('/place-order', checkAuth, controller.placeOrder);
router.get('/get-all-orders-by-user', checkAuth, controller.getAllOrdersByUser);
router.get('/get-order-details/:id', controller.getOrderDetailsById);
router.get('/get-all-transactions-by-user', checkAuth, controller.getAllTransactionByUser);
router.get("/get-single-order-by-user/:orderId", checkAuth, controller.getSingleOrderByUser);
router.get("/get-single-order-by-user-admin/:orderId", checkAdminAuth, controller.getSingleOrderByUser);
router.put('/cancel-order-by-user/:orderId', checkAuth, controller.cancelOrderByUser);


// ADMIN

router.get("/v2/get-single-order-by-admin/:orderId", checkAdminAuth, controller.getSingleOrderByAdminV2);
router.post('/v2/get-all-orders-by-admin', checkAdminAuth, controller.getAllOrdersByAdminV2);
router.get('/v2/get-all-transaction-by-admin', checkAdminAuth, controller.getAllTransactionByAdminV2);
router.get("/v2/get-all-orders-by-userId/:userId", checkAdminAuth, controller.getUserOrdersByAminV2);
router.get('/v2/get-all-canceled-orders', checkAdminAuth, controller.getAllCanceledOrdersByAdminV2);
router.get('/v2/get-all-orders-by-admin-no-paginate', checkAdminAuth, controller.getAllOrdersByAdminNoPaginateV2);
router.put('/v2/change-order-status', checkAdminAuth, controller.changeDeliveryStatusV2);
router.delete('/v2/delete-order-by-admin/:orderId', checkAdminAuth, controller.deleteOrderByAdminV2);
router.post('/v2/get-orders-by-filter-data/:deliveryStatus', checkAdminAuth, controller.filterByDynamicFiltersV2);
router.post('/v2/get-orders-by-date-range-data/:startDate/:endDate', checkAdminAuth, controller.filterByDateRangeV2);
router.post('/v2/update-single-order',checkAdminAuth,controller.updateSingleOrderByIdV2);
router.get('/v2/all-order-group-by-publisher',controller.allOrderGroupByPublisherV2);

router.get("/get-single-order-by-admin/:orderId", checkAdminAuth, controller.getSingleOrderByAdmin);
router.post('/get-all-orders-by-admin', checkAdminAuth, controller.getAllOrdersByAdmin);
router.get('/get-all-transaction-by-admin', checkAdminAuth, controller.getAllTransactionByAdmin);
router.get("/get-all-orders-by-userId/:userId", checkAdminAuth, controller.getUserOrdersByAmin);
router.get('/get-all-canceled-orders', checkAdminAuth, controller.getAllCanceledOrdersByAdmin);
router.get('/get-all-orders-by-admin-no-paginate', checkAdminAuth, controller.getAllOrdersByAdminNoPaginate);
router.put('/change-order-status', checkAdminAuth, controller.changeDeliveryStatus);
router.delete('/delete-order-by-admin/:orderId', checkAdminAuth, controller.deleteOrderByAdmin);
router.post('/get-orders-by-filter-data/:deliveryStatus', checkAdminAuth, controller.filterByDynamicFilters);
router.post('/get-orders-by-date-range-data/:startDate/:endDate', checkAdminAuth, controller.filterByDateRange);
router.post('/update-single-order',checkAdminAuth,controller.updateSingleOrderById);

// Export router class..
module.exports = router;
