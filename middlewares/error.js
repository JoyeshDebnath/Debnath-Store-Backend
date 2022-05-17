const ErrorHander = require("../utils/error-handler");

const Error = (err, req, res, next) => {
	err.statusCode = err.statusCode || 5000;
	err.message = err.message || "Internal Server Error";
	res.status(err.statusCode).json({
		success: false,
		error: err.stack,
		message: err.message,
	});
};

module.exports = Error;
