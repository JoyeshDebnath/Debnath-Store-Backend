const express = require("express");
//route imports ..
const errorMiddleware = require("./middlewares/error");
const cookieParser = require("cookie-parser");
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoutes");
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);
//middleware fro error s
app.use(errorMiddleware);
module.exports = app;
