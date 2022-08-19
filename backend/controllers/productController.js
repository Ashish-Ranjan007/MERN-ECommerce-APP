const Product = require('../models/productModel');
const ApiFeatures = require('../utils/apiFeatures');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');

// Create Product -- Admin
exports.createProduct = catchAsyncError(async (req, res, next) => {
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
