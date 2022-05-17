const dotenv = require("dotenv");
const express = require("express");

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
		console.log("Connected to the database");
		app.listen(PORT, () => {
			console.log(`Server is listening on PORT =${PORT}`);
		});
	} catch (err) {
		console.log(err);
	}
};

start();
