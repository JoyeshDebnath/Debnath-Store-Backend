const dotenv = require("dotenv");
const express = require("express");
const cloudinary = require("cloudinary");
const ConnectDB = require("./db/connect");
const app = require("./app");
// const connectDB = require("./db/connect");

//configure .env
dotenv.config({ path: "backend/config/config.env" });

const PORT = process.env.PORT;
const connectionString = process.env.MONGO_URI;

const start = async () => {
	try {
		await ConnectDB(connectionString);
		//cloudinary related work
		cloudinary.config({
			cloud_name: process.env.CLOUDINARY_NAME,
			api_key: process.env.CLOUDINARY_API_KEY,
			api_secret: process.env.CLOUDINARY_API_SECRET,
		});

		// cloudinary work
		console.log("Connected to the database");
		app.listen(PORT, () => {
			console.log(`Server is listening on PORT =${PORT}`);
		});
	} catch (err) {
		console.log(err);
	}
};

start();
