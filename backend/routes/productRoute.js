// Third party modules
const express = require('express');

// Local modules
const productController = require('../controllers/productController');

// Initialized express router
const router = express.Router();

// Routes
router.get('/products', productController.getAllProducts);
router.post('/product/new', productController.createProduct);
router.put('/product/:id', productController.updateProduct);
router.delete('/product/:id', productController.deleteProduct);
router.get('/product/:id', productController.getProductDetails);

module.exports = router;
