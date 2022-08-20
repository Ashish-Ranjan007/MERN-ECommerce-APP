const express = require('express');

const userController = require('../controllers/userController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

// Initializing express router
const router = express.Router();

// Routes
router.get(
	'/admin/users',
	isAuthenticatedUser,
	authorizeRoles('admin'),
	userController.getAllUsers
);
router.put(
	'/password/update',
	isAuthenticatedUser,
	userController.updatePassword
);
router.get(
	'/admin/user/:id',
	isAuthenticatedUser,
	authorizeRoles('admin'),
	userController.getSingleUser
);
router.put(
	'/admin/user/:id',
	isAuthenticatedUser,
	authorizeRoles('admin'),
	userController.updateUserRole
);
router.delete(
	'/admin/user/:id',
	isAuthenticatedUser,
	authorizeRoles('admin'),
	userController.deleteUser
);
router.post('/login', userController.loginUser);
router.get('/logout', userController.logoutUser);
router.post('/register', userController.registerUser);
router.post('/password/forgot', userController.forgotPassword);
router.put('/password/reset/:token', userController.resetPassword);
router.get('/me', isAuthenticatedUser, userController.getUserDetail);
router.put('/me/update', isAuthenticatedUser, userController.updateProfile);

module.exports = router;
