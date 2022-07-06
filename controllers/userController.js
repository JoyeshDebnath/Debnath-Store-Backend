const User = require("../models/userModel");
const sendToken = require("../utils/jwtTokens");
const CatchAsyncError = require("../middlewares/catchAsyncErrors");
const ErrorHander = require("../utils/error-handler");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
//Register a new  User
const RegisterUser = CatchAsyncError(async (req, res, next) => {
	const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
		folder: "avatars",
		width: 150,
		crop: "scale",
	});

	//take the name ,email and password of the user from request body
	const { name, email, password } = req.body;
	// console.log(name, email, password);
	//create a new user ..
	const user = await User.create({
		name,
		email,
		password,
		avatar: {
			public_id: myCloud.public_id,
			url: myCloud.secure_url,
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
		email,
	}).select("+password");
	if (!user) {
		return next(new ErrorHander("Invalid email OR password !", 401));
	}

	const isPasswordMatched = await user.comparePassword(password);
	// console.log(isPasswordMatched);
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

//user vroutes :   get user details
const getUserDetails = CatchAsyncError(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	res.status(200).json({
		sucess: true,
		user,
	});
});

//User routes : change password
const updateUserPassword = CatchAsyncError(async (req, res, next) => {
	const user = await User.findById(req.user.id).select("+password");
	const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
	//check if the old  password  exists
	if (!isPasswordMatched) {
		return next(new ErrorHander("Old Password is not correct!", 400));
	}
	//check if the new password matches with confirmed password or not
	if (req.body.newPassword !== req.body.confirmPassword) {
		return next(new ErrorHander("Password does not match", 400));
	}
	//if everything ok ?
	user.password = req.body.newPassword;
	await user.save();

	sendToken(user, 200, res);
});

//update Profile
const updateProfile = CatchAsyncError(async (req, res, next) => {
	const newUserData = {
		name: req.body.name,
		email: req.body.email,
	};
	//TODO:  cloudinary to be added
	const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
		new: true,
		runValidators: true,
		useFindAndModify: false,
	});
	res.status(200).json({
		success: true,
		user,
	});
});

//ANCHOR  :  (For admin ):  get all users
const getAllUsers = CatchAsyncError(async (req, res, next) => {
	const users = await User.find();
	res.status(200).json({
		success: true,
		users,
	});
});

//ANCHOR  :  (For admin ):  get  a single  user..
const getUser = CatchAsyncError(async (req, res, next) => {
	const user = await User.findById(req.params.id);
	if (!user) {
		return next(
			new ErrorHander(
				`User does not exist for the given ID : ${req.params.id}`,
				404
			)
		);
	}
	res.status(200).json({
		success: true,
		user,
	});
});

//ANCHOR : For Admin --- update the user profiles ie change the roles ...

//update user role
const updateRole = CatchAsyncError(async (req, res, next) => {
	const newUserData = {
		name: req.body.name,
		email: req.body.email,
		role: req.body.role,
	};

	const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
		new: true,
		runValidators: true,
		useFindAndModify: false,
	});
	res.status(200).json({
		success: true,
		user,
	});
});

//ANCHOR : For Admin --- update the user profiles ie change the roles ...

//Delete a  user  from DB by admin
const deleteUser = CatchAsyncError(async (req, res, next) => {
	//TODO we will delete cloduinary
	const user = await User.findById(req.params.id);

	if (!user) {
		return next(
			new ErrorHander(
				`User does not exist for the given ID : ${req.params.id}`,
				404
			)
		);
	}
	await user.remove();

	res.status(200).json({
		success: true,
		user,
		message: `The User with ID ${req.params.id} has been removed`,
	});
});

module.exports = {
	RegisterUser,
	loginUser,
	logout,
	forgotPassword,
	resetPassword,
	getUserDetails,
	updateUserPassword,
	updateProfile,
	getUser,
	getAllUsers,
	deleteUser,
	updateRole,
};
