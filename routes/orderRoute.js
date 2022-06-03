const {
	createOrder,
	getSingleOrder,
	myOrders,
} = require("../controllers/orderController");
const router = require("express").Router();
const { isAuthenticatedUser, authorizedRoles } = require("../middlewares/auth");

router.route("/order/new").post(isAuthenticatedUser, createOrder);
router.route("/orders/me").get(isAuthenticatedUser, myOrders);
//for admin he can see all the ordes placed by user
router
	.route("/order/:id")
	.get(isAuthenticatedUser, authorizedRoles("admin"), getSingleOrder);

module.exports = router;
