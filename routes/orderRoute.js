const {
	createOrder,
	getSingleOrder,
	myOrders,
	getAllOrders,
	deleteOrder,
	updateOrder,
} = require("../controllers/orderController");
const router = require("express").Router();
const { isAuthenticatedUser, authorizedRoles } = require("../middlewares/auth");

router.route("/order/new").post(isAuthenticatedUser, createOrder);
router.route("/orders/me").get(isAuthenticatedUser, myOrders);

router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

//for admin
router
	.route("/admin/orders")
	.get(isAuthenticatedUser, authorizedRoles("admin"), getAllOrders);
router
	.route("/admin/order/:id")
	.put(isAuthenticatedUser, authorizedRoles("admin"), updateOrder)
	.delete(isAuthenticatedUser, authorizedRoles("admin"), deleteOrder);

module.exports = router;
