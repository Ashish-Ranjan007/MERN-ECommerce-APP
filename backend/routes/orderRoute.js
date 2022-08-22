const express = require('express');

const orderController = require('../controllers/orderController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

// Create Order
router.get('/order/me', isAuthenticatedUser, orderController.myOrders);
router.get('/order/:id', isAuthenticatedUser, orderController.getSingleOrder);
router.post('/order/new', isAuthenticatedUser, orderController.newOrder);
router.get(
	'/admin/orders',
	isAuthenticatedUser,
	authorizeRoles('admin'),
	orderController.getAllOrders
);
router.put(
	'/admin/order/:id',
	isAuthenticatedUser,
	authorizeRoles('admin'),
	orderController.updateOrder
);
router.delete(
	'/admin/order/:id',
	isAuthenticatedUser,
	authorizeRoles('admin'),
	orderController.deleteOrder
);

module.exports = router;
