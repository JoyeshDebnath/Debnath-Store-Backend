const User = require("../models/userModel");
const sendToken = require("../utils/jwtTokens");
const CatchAsyncError = require("../middlewares/catchAsyncErrors");
const ErrorHander = require("../utils/error-handler");

//Register a new  User
const RegisterUser = CatchAsyncError(async (req, res, next) => {
	//take the name ,email and password of the user from request body
	const { name, email, password } = req.body;
	// console.log(name, email, password);
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

	sendToken(user, 201, res);
}); //resgiter a user controoller

//login a user ...
const loginUser = CatchAsyncError(async (req, res, next) => {
	const { email, password } = req.body;
	//check if the User has provided bot email and password

	if (!email || !password) {
		return next(new ErrorHander("Provide both email and password !", 400));
	}

	//find the user
	const user = await User.findOne({
		email: email,
	}).select("+password");
	if (!user) {
		return next(new ErrorHander("Invalid email OR password !", 401));
	}

	const isPasswordMatched = user.comparePassword(password);
	if (!isPasswordMatched) {
		return next(new ErrorHander("Invalid password OR Emial!", 401));
	}
	//if everything is ok

	sendToken(user, 200, res);
}); //login user

//user logout ..
const logout = CatchAsyncError(async (req, res, next) => {
	res.cookie("token", null, {
		expires: new Date(Date.now()),
		httpOnly: true,
	});

	res.status(200).json({
		success: true,
		message: "Logged Out!",
	});
});

module.exports = {
	RegisterUser,
	loginUser,
	logout,
};
