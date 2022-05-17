const express = require("express");
//route imports ..
const productRoute = require("./routes/productRoute");
const app = express();
app.use(express.json());

app.use("/api/v1", productRoute);
module.exports = app;
