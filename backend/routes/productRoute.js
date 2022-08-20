// Third party modules
const express = require('express');

// Local modules
const productController = require('../controllers/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

// Initialized express router
const router = express.Router();

// Routes
router.post(
	'/admin/product/new',
	isAuthenticatedUser,
	authorizeRoles('admin'),
	productController.createProduct
);
router.put(
	'/admin/product/:id',
	isAuthenticatedUser,
	authorizeRoles('admin'),
	productController.updateProduct
);
router.delete(
	'/admin/product/:id',
	isAuthenticatedUser,
	authorizeRoles('admin'),
	productController.deleteProduct
);
router.put(
	'/review',
	isAuthenticatedUser,
	productController.createProductReview
);
router.get('/products', productController.getAllProducts);
router.get('/reviews', productController.getProductReviews);
router.get('/product/:id', productController.getProductDetails);
router.delete('/reviews', isAuthenticatedUser, productController.deleteReview);

module.exports = router;
