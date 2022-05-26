const router = require("express").Router();
const { isAuthenticatedUser, authorizedRoles } = require("../middlewares/auth");

const {
	getAllProducts,
	createProduct,
	updateProduct,
	deleteProduct,
	getProduct,
} = require("../controllers/productController");

router.route("/products").get(getAllProducts);
router
	.route("/product/new")
	.post(isAuthenticatedUser, authorizedRoles("admin"), createProduct);
router
	.route("/product/:id")
	.put(isAuthenticatedUser, authorizedRoles("admin"), updateProduct)
	.get(getProduct)
	.delete(isAuthenticatedUser, authorizedRoles("admin"), deleteProduct);

module.exports = router;
