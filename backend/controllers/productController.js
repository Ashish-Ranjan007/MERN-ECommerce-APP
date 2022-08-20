const Product = require('../models/productModel');
const ApiFeatures = require('../utils/apiFeatures');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');

// Create Product -- Admin
exports.createProduct = catchAsyncError(async (req, res, next) => {
	req.body.user = req.user.id;

	const product = await Product.create(req.body);

	res.status(201).json({ success: true, product });
});

// Get single product
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
	const prodId = req.params.id;

	const product = await Product.findById(prodId);

	if (!product) {
		return next(new ErrorHandler('Product not found', 404));
	}

	res.status(200).json({ success: true, product });
});

// Get all products
exports.getAllProducts = catchAsyncError(async (req, res) => {
	const resultPerPage = 5;
	const productCount = await Product.countDocuments();

	const apiFeatures = new ApiFeatures(Product.find(), req.query)
		.search()
		.filter()
		.pagination(resultPerPage);
	const products = await apiFeatures.query;

	res.status(200).json({ success: true, products, productCount });
});

// Update product -- Admin
exports.updateProduct = catchAsyncError(async (req, res) => {
	const prodId = req.params.id;

	let product = await Product.findById(prodId);

	if (!product) {
		return next(new ErrorHandler('Product not found', 404));
	}

	product = await Product.findByIdAndUpdate(prodId, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({ success: true, product });
});

// Delete Product --Admin
exports.deleteProduct = catchAsyncError(async (req, res) => {
	const prodId = req.params.id;

	let product = await Product.findById(prodId);

	if (!product) {
		return next(new ErrorHandler('Product not found', 404));
	}

	await product.remove();

	res.status(200).json({
		success: true,
		message: 'Product deleted successfully',
	});
});

// Create and Update new review
exports.createProductReview = catchAsyncError(async (req, res, next) => {
	const { rating, comment, productId } = req.body;

	const review = {
		user: req.user._id,
		name: req.user.name,
		rating: Number(rating),
		comment: comment,
	};

	const product = await Product.findById(productId);

	const isReviwed = product.reviews.find((review) => {
		return review.user.toString() === req.user._id.toString();
	});

	if (isReviwed) {
		product.reviews.forEach((review) => {
			if (review.user.toString() === req.user._id.toString()) {
				(review.rating = rating), (review.comment = comment);
			}
		});
	} else {
		product.reviews.push(review);
		product.numOfReviews = product.reviews.length;
	}

	let sum = 0;

	product.reviews.forEach((review) => {
		sum += review.rating;
	});

	product.ratings = sum / product.reviews.length;

	await product.save({ validateBeforeSave: false });

	res.status(200).json({ success: true });
});

// Get all reviews of a product
exports.getProductReviews = catchAsyncError(async (req, res, next) => {
	const product = await Product.findById(req.query.id);

	if (!product) {
		return next(new ErrorHandler('Product does not exists', 404));
	}

	res.status(200).json({ success: true, reviews: product.reviews });
});

// Delete review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
	const product = await Product.findById(req.query.productId);

	if (!product) {
		return next(new ErrorHandler('Product does not exists', 404));
	}

	const reviews = product.reviews.filter((review) => {
		return review._id.toString() !== req.query.id.toString();
	});

	let sum = 0;

	reviews.forEach((review) => {
		sum += review.rating;
	});

	const ratings = sum / reviews.length || 0;

	const numOfReviews = reviews.length;

	await Product.findByIdAndUpdate(
		req.query.productId,
		{
			reviews,
			ratings,
			numOfReviews,
		},
		{ new: true, runValidators: true }
	);

	res.status(200).json({ success: true, reviews: product.reviews });
});
