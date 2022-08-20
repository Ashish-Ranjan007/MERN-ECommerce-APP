const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');

// Register an user
exports.registerUser = catchAsyncError(async (req, res, next) => {
	const { name, email, password } = req.body;

	const user = await User.create({
		name,
		email,
		password,
		avatar: { publicId: 'sample_id', url: 'sample_url' },
	});

	const token = user.getJWTToken();

	// send response and set token
	sendToken(res, user, 200);
});

// Login an user
exports.loginUser = catchAsyncError(async (req, res, next) => {
	const { email, password } = req.body;

	// validating user
	if (!email || !password) {
		return next(new ErrorHandler('Please enter email & password', 400));
	}

	const user = await User.findOne({ email: email }).select('+password');

	if (!user) {
		return next(new ErrorHandler('Invalid email or password', 401));
	}

	const isValidPassword = user.comparePassword(password);

	if (!isValidPassword) {
		return next(new ErrorHandler('Invalid email or password', 401));
	}

	const token = user.getJWTToken();

	// send response and set token
	sendToken(res, user, 200);
});

// Logout an user
exports.logoutUser = catchAsyncError((req, res, next) => {
	res.cookie('token', null, {
		expires: new Date(Date.now()),
		httpOnly: true,
	});

	res.status(200).json({
		success: true,
		message: 'User logged out successfully',
	});
});

// Forgot password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		return next(new ErrorHandler('User not found', 404));
	}

	// Get reset password token
	const resetToken = user.getResetPasswordToken();

	await user.save({ validateBeforeSave: false });

	const resetPasswordUrl = `${req.protocol}://${req.get(
		'host'
	)}/api/v1/password/${resetToken}`;

	const message = `Your password reset token is :- \n\n${resetPasswordUrl} \n\nIf yout have not requested this email then please ignore it`;

	try {
		await sendEmail({
			email: user.email,
			subject: `ECommerce Password Recovery`,
			message,
		});

		res.status(200).json({
			success: true,
			message: `Email is sent to ${user.email} successfully`,
		});
	} catch (error) {
		user.resetPasswordToken = undefined;
		user.resetPasswordExpired = undefined;

		await user.save({ validateBeforeSave: false });

		return next(new ErrorHandler(error.message, 500));
	}
});

// Reset password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
	// Creating token hash
	const resetPasswordToken = crypto
		.createHash('sha256')
		.update(req.params.token)
		.digest('hex');

	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpired: { $gt: Date.now() },
	});

	if (!user) {
		return next(
			new ErrorHandler(
				'Reset password token is invalid or has expired',
				404
			)
		);
	}

	if (req.body.password != req.body.confirmPassword) {
		return next(new ErrorHandler('Password does not match', 404));
	}

	user.password = req.body.password;

	user.resetPasswordToken = undefined;
	user.resetPasswordExpired = undefined;

	await user.save();

	sendToken(res, user, 200);
});

// Get user details
exports.getUserDetail = catchAsyncError(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	res.status(200).json({ success: true, user });
});

// Update user password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
	console.log(req.user);
	const user = await User.findById(req.user.id).select('+password');

	const isValidPassword = await user.comparePassword(req.body.oldPassword);

	if (!isValidPassword) {
		return next(new ErrorHandler('Old password is incorrect', 400));
	}

	if (req.body.newPassword != req.body.confirmPassword) {
		return next(new ErrorHandler('Password does not match'));
	}

	user.password = req.body.newPassword;

	await user.save();

	sendToken(res, user, 200);
});

// Update user profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
	const newUserData = {
		name: req.body.name,
		email: req.body.email,
	};

	const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({ success: true, user });
});

// Get all users
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
	const users = await User.find();

	res.status(200).json({
		success: true,
		users,
	});
});

// Get single user --Admin
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return next(new ErrorHandler('User not found'));
	}

	res.status(200).json({
		success: true,
		user,
	});
});

// Update user role --Admin
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
	const newUserData = {
		role: req.body.role,
	};

	const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({ success: true, user });
});

// Delete user --Admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return next(new ErrorHandler('User does not exists'));
	}

	await user.remove();

	res.status(200).json({
		success: true,
		message: 'User deleted successfully',
	});
});
