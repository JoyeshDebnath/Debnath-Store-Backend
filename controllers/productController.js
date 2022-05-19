const Product = require("../models/productModel");
const ErrorHander = require("../utils/error-handler");
const CatchAsyncError = require("../middlewares/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
//create a products ..ADMIN
const createProduct = CatchAsyncError(async (req, res, next) => {
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

	const apifeature = new ApiFeatures(Product.find({}), req.query)
		.search()
		.filter()
		.pagination(resultsPerPage); //api feature class

	const products = await apifeature.query;
	res.status(200).json({
		success: true,
		products,
		noHits: products.length,
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

module.exports = {
	getAllProducts,
	createProduct,
	updateProduct,
	deleteProduct,
	getProduct,
};
