const Order = require("../models/orderModels");
const Product = require("../models/productModel");
const ErrorHander = require("../utils/error-handler");
const CatchAsyncError = require("../middlewares/catchAsyncErrors");

//create a new Order..
const createOrder = CatchAsyncError(async (req, res, next) => {
	const {
		shippingInfo,
		orderItems,
		paymentInfo,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
	} = req.body;

	const order = await Order.create({
		shippingInfo,
		orderItems,
		paymentInfo,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
		paidAt: Date.now(),
		user: req.user._id,
	});

	res.status(201).json({
		success: true,
		order,
	});
});

//Get a Single Order ..

const getSingleOrder = CatchAsyncError(async (req, res, next) => {
	//NOTE : by using the populate we are extracting the name and user email information from user model for the given user (using the uder ID we saved in the Order model )
	const order = await Order.findById(req.params.id).populate(
		"user",
		"name email"
	);

	if (!order) {
		return next(new ErrorHander("Order Not Found!", 404));
	}
	res.status(200).json({
		success: true,
		order,
	});
});
//get logged in user orders ...
const myOrders = CatchAsyncError(async (req, res, next) => {
	//NOTE :get all the orders placed by the specific user .. We are filtering by the user id of the user logged in
	const orders = await Order.find({ user: req.user._id });

	res.status(200).json({
		success: true,
		orders,
	});
});

module.exports = {
	createOrder,
	getSingleOrder,
	myOrders,
};
