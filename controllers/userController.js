const User = require("../models/userModel");
const sendToken = require("../utils/jwtTokens");
const CatchAsyncError = require("../middlewares/catchAsyncErrors");
const ErrorHander = require("../utils/error-handler");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

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

const forgotPassword = CatchAsyncError(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		return next(new ErrorHander("User was not Found !", 404));
	}
	//get reset password Token ..
	const resetToken = user.getResetPasswordToken();
	await user.save({ validateBeforeSave: false });
	//settin g the link
	const resetPasswordURL = `${req.protocol}://${req.get(
		"host"
	)}/api/v1/password/${resetToken}`;
	//message
	const message = `Your password reset token is : \n\n ${resetPasswordURL} \n\n If you have not requested then pls ignore it  😎`;
	//now send the message
	try {
		await sendEmail({
			email: user.email,
			subject: `Ecommerce password reset`,
			message,
		});

		res.status(200).json({
			success: true,
			message: `Email was sent to ${user.email} successfully!`,
		});
	} catch (error) {
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save({ validateBeforeSave: false });
		return next(new ErrorHander(error.message, 500));
	}
});

//reset password ..
const resetPassword = CatchAsyncError(async (req, res, next) => {
	//creating token hash
	const resetPasswordToken = crypto
		.createHash("sha256")
		.update(req.params.token)
		.digest("hex");

	//find the user base on resetpassword token
	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpire: { $gt: Date.now() },
	});

	//if not user is found .. then
	if (!user) {
		return next(
			new ErrorHander("Reset password token not invalid or expired !", 400)
		);
	}

	if (req.body.password !== req.body.confirmPassword) {
		return next(new ErrorHander("password does not match", 400));
	}

	user.password = req.body.password;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpire = undefined;
	await user.save();
	sendToken(user, 200, res);
});

module.exports = {
	RegisterUser,
	loginUser,
	logout,
	forgotPassword,
	resetPassword,
};
