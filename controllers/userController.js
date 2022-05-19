const User = require("../models/userModel");
const CatchAsyncError = require("../middlewares/catchAsyncErrors");
const ErrorHander = require("../utils/error-handler");

//Register a new  User
const RegisterUser = CatchAsyncError(async (req, res, next) => {
	//take the name ,email and password of the user from request body
	const { name, email, password } = req.body;
	console.log(name, email, password);
	//create a new user ..
	const user = await User.create({
		name,
		email,
		password,
		avatar: {
			public_id: "This a sample id ",
			url: "profilePicURL",
		},
	});

	res.status(201).json({
		success: true,
		user,
	});
}); //resgiter a user controoller

module.exports = {
	RegisterUser,
};
