// Third party modules
const express = require('express');

// Local modules
const productController = require('../controllers/productController');

// Initialized express router
const router = express.Router();

// Routes
router.get('/products', productController.getAllProduct);

module.exports = router;
