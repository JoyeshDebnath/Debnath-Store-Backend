const express = require("express");
//route imports ..
const errorMiddleware = require("./middlewares/error");
const productRoute = require("./routes/productRoute");
const app = express();
app.use(express.json());

app.use("/api/v1", productRoute);
//middleware fro error s
app.use(errorMiddleware);
module.exports = app;
