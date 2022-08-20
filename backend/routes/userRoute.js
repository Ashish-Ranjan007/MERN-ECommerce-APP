const express = require('express');

const userController = require('../controllers/userController');

// Initializing express router
const router = express.Router();

// Routes
router.post('/login', userController.loginUser);
router.get('/logout', userController.logoutUser);
router.post('/register', userController.registerUser);
router.post('/password/forgot', userController.forgotPassword);
router.put('/password/reset/:token', userController.resetPassword);

module.exports = router;
