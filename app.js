const express = require("express");
//route imports ..
const errorMiddleware = require("./middlewares/error");
const cookieParser = require("cookie-parser");
//all the routes import
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoutes");
const orderRoute = require("./routes/orderRoute");
//middlewares
const app = express();
app.use(express.json());
app.use(cookieParser());
//routes setup
app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);
//middleware fro error s
app.use(errorMiddleware);
module.exports = app;
