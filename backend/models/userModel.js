const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please enter your name'],
		maxLength: [30, 'Name cannot exceed 30 characters'],
		minLength: [4, 'Name cannot contain less than 5 characters'],
	},
	email: {
		type: String,
		required: [true, 'Please enter your email'],
		unique: true,
		validate: [validator.isEmail, 'Please enter a valid email'],
	},
	password: {
		type: String,
		required: [true, 'Please enter your password'],
		minLength: [8, 'Password shoudld be atleast 8 characters'],
		select: false,
	},
	avatar: {
		publicId: {
			type: String,
			required: true,
		},
		url: {
			type: String,
			required: true,
		},
	},
	role: {
		type: String,
		default: 'user',
	},
	resetPasswordToken: String,
	resetPasswordExpired: Date,
});

userSchema.pre('save', async function (next) {
	if (this.isModified('password')) {
		this.password = await bcrypt.hash(this.password, 12);
	}

	next();
});

// JWT
userSchema.methods.getJWTToken = function () {
	return JWT.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});
};

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
	// Generate Token
	const resetToken = crypto.randomBytes(20).toString('hex');

	// Hashing and adding to user schema
	this.resetPasswordToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	this.resetPasswordExpired = Date.now() + 15 * 60 * 1000;

	return resetToken;
};

module.exports = mongoose.model('User', userSchema);
