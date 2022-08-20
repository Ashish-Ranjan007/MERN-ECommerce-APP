const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('./catchAsyncError');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
	const { token } = req.cookies;

	if (!token) {
		return next(
			new ErrorHandler('Please login to access this resource', 401)
		);
	}

	// Decode userInfo from jwt token
	let userInfo = jwt.verify(token, process.env.JWT_SECRET);

	// Save userInfo in request object
	req.user = await User.findById(userInfo.id);

	next();
});

exports.authorizeRoles =
	(...roles) =>
	(req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new ErrorHandler(
					`Role: ${req.user.role} is not allowed to access this resource`,
					403
				)
			);
		}

		next();
	};
