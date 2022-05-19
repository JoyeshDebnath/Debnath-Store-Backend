const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Name Is Required !"],
		maxLength: [40, "name cant exceed 40 characters !"],
		minLength: [3, "name has to greater than 3 characters !"],
	},
	email: {
		type: String,
		required: [true, "Email is required!"],
		minLength: [5, "mail has to be greater than 5 characters"],
		maxLength: [25, "mail cannot be greater than 25 characters "],
		unique: [true, "Email already exists ! try another one "],
		validate: [validator.isEmail, "Pls enter a valid email !"],
	},
	password: {
		type: String,
		required: [true, "Password must be provided !"],
		minLength: [5, "password must be greater than 5 characters"],
		select: false,
	},
	avatar: {
		public_id: {
			type: String,
			required: true,
		},
		url: {
			type: String,
			required: true,
		},
	},
	role: {
		type: String,
		default: "user",
	},
	resetPasswordToken: String,
	resetPasswordExpire: Date,
});

module.exports = mongoose.model("Users", userSchema);
