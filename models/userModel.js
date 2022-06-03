const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

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

//hash password
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}
	this.password = await bcrypt.hash(this.password, 10);
});

//JWT tokens
userSchema.methods.getJwtToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});
};

//comapare password
userSchema.methods.comparePassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password); //compare the entered password with the hashed password
}; //compare the password

//generating password  Reset Token
userSchema.methods.getResetPasswordToken = function () {
	//generate a token
	const resetToken = crypto.randomBytes(20).toString("hex");
	//hahsing and adding to user schema
	this.resetPasswordToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");

	this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

	return resetToken;
};

module.exports = mongoose.model("User", userSchema);
