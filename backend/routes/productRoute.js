// Third party modules
const express = require('express');

// Local modules
const productController = require('../controllers/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

// Initialized express router
const router = express.Router();

// Routes
router.post(
	'/product/new',
	isAuthenticatedUser,
	authorizeRoles('admin'),
	productController.createProduct
);
router.put(
	'/product/:id',
	isAuthenticatedUser,
	authorizeRoles('admin'),
	productController.updateProduct
);
router.delete(
	'/product/:id',
	isAuthenticatedUser,
	authorizeRoles('admin'),
	productController.deleteProduct
);
router.get('/products', productController.getAllProducts);
router.get('/product/:id', productController.getProductDetails);

module.exports = router;
