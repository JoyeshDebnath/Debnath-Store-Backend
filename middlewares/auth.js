const CatchAsyncError = require("./catchAsyncErrors");
const ErrorHandler = require("../utils/error-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const isAuthenticatedUser = CatchAsyncError(async (req, res, next) => {
	const { token } = req.cookies;
	// console.log(token);
	if (!token) {
		return next(new ErrorHandler("Please Login to access this resource.", 401));
	}
	const decodedData = jwt.verify(token, process.env.JWT_SECRET);

	req.user = await User.findById(decodedData.id);
	next();
});

const authorizedRoles = (...roles) => {
	return (req, res, next) => {
		//if the admin role is not included
		if (!roles.includes(req.user.role)) {
			return next(
				new ErrorHandler(
					`Role: ${req.user.role} is not allowed to access this resource`,
					403
				)
			);
		}
		next();
	};
};

module.exports = { isAuthenticatedUser, authorizedRoles };
