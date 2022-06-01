const Product = require("../models/productModel");
const ErrorHander = require("../utils/error-handler");
const CatchAsyncError = require("../middlewares/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
//create a products ..ADMIN
const createProduct = CatchAsyncError(async (req, res, next) => {
	req.body.user = req.user.id;

	const product = await Product.create(req.body);
	res.status(201).json({
		success: true,
		product,
	});
});

//get all products ..
// ?set the filtering and searching  functionality
const getAllProducts = CatchAsyncError(async (req, res) => {
	const resultsPerPage = 5; //per page 5 items //
	const productCount = await Product.countDocuments();

	const apifeature = new ApiFeatures(Product.find({}), req.query)
		.search()
		.filter()
		.pagination(resultsPerPage); //api feature class

	const products = await apifeature.query;
	res.status(200).json({
		success: true,
		products,
		productCount,
	});
	//res.status(200).json({ message: "Get all products route working fine " });
});

//Update a product..ADMIN ..
const updateProduct = CatchAsyncError(async (req, res, next) => {
	let product = await Product.findById(req.params.id);
	//if the product could not be found
	if (!product) {
		return next(new ErrorHander("Product Not Found!", 404));
	}
	//else if product was found then update it ..
	product = await Product.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
		useFindAndModify: false,
	});
	res.status(200).json({
		success: true,
		product,
	});
});

//DELETE A PRODUCT ...ADMIN
const deleteProduct = CatchAsyncError(async (req, res, next) => {
	//1st find the product with the given id
	let product = await Product.findById(req.params.id);
	if (!product) {
		return res.status(500).json({
			success: false,
			message: "The given product does not exist!",
		});
	}
	//if the product exisits then delete
	await Product.findByIdAndDelete(req.params.id);
	res.status(200).json({
		success: true,
		message: "Product was deleted successfully",
	});
});

//GET A SINGLE PRODUCT ...
const getProduct = CatchAsyncError(async (req, res, next) => {
	//find the product ..
	const product = await Product.findById(req.params.id);
	if (!product) return next(new ErrorHander("Product not found", 404));

	res.status(200).json({
		success: true,
		product,
	});
});

//create reviews and update reviews if already created....
const createProductReview = CatchAsyncError(async (req, res, next) => {
	const { rating, comment, productId } = req.body;

	const review = {
		user: req.user._id,
		name: req.user.name,
		rating: Number(rating),
		comment,
	};
	const product = await Product.findById(productId);

	//NOTE: check if the poduct with given id was already reviewd aerlier or not ....

	const isReviewed = product.reviews.find(
		(rev) => rev.user.toString() === req.user._id.toString()
	);
	if (isReviewed) {
		//if already reviewd then update the review part
		product.reviews.forEach((rev) => {
			if (rev.user.toString() === req.user._id.toString()) {
				rev.rating = rating;
				rev.comment = comment;
			}
		});
	} else {
		product.reviews.push(review);
		//update the number of reviews if a new review entered
		product.numOfReviews = product.reviews.length;
	}

	//find the overall rating for the given product ......
	let avg = 0;

	product.reviews.forEach((rev) => {
		avg += rev.rating;
	});
	product.ratings = avg / product.reviews.length;
	await product.save({ validateBeforeSave: false });
	res.status(200).json({
		success: true,
	});
});

module.exports = {
	getAllProducts,
	createProduct,
	updateProduct,
	deleteProduct,
	getProduct,
	createProductReview,
};
