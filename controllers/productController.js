const Product = require("../models/productModel");

//create a products ..ADMIN
const createProduct = async (req, res, next) => {
	const product = await Product.create(req.body);
	res.status(201).json({
		success: true,
		product,
	});
};

//get all products ..
const getAllProducts = async (req, res) => {
	const products = await Product.find({});
	res.status(200).json({
		success: true,
		products,
	});
	//res.status(200).json({ message: "Get all products route working fine " });
};

//Update a product..ADMIN ..
const updateProduct = async (req, res, next) => {
	let product = await Product.findById(req.params.id);
	//if the product could not be found
	if (!product) {
		return res.status(500).json({
			success: false,
			message: "Product not found!",
		});
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
};

//DELETE A PRODUCT ...ADMIN
const deleteProduct = async (req, res, next) => {
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
};

module.exports = {
	getAllProducts,
	createProduct,
	updateProduct,
	deleteProduct,
};
