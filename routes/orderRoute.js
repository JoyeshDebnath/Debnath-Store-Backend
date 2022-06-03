const { createOrder } = require("../controllers/orderController");
const router = require("express").Router();
const { isAuthenticatedUser, authorizedRoles } = require("../middlewares/auth");

router.route("/order/new").post(isAuthenticatedUser, createOrder);

module.exports = router;
