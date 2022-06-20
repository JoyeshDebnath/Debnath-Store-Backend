const router = require("express").Router();
const { isAuthenticatedUser, authorizedRoles } = require("../middlewares/auth");

const {
	getAllProducts,
	createProduct,
	updateProduct,
	deleteProduct,
	getProduct,
	createProductReview,
	getProductReviews,
	deleteProductReview,
} = require("../controllers/productController");

router.route("/products").get(getAllProducts);
router
	.route("/admin/product/new")
	.post(isAuthenticatedUser, authorizedRoles("admin"), createProduct);
router
	.route("/admin/product/:id")
	.put(isAuthenticatedUser, authorizedRoles("admin"), updateProduct)
	.get(getProduct)
	.delete(isAuthenticatedUser, authorizedRoles("admin"), deleteProduct);
//get a single product
router.route("/product/:id").get(getProduct);
//get reviews and create reviews
router.route("/review").put(isAuthenticatedUser, createProductReview);

router
	.route("/reviews")
	.get(getProductReviews)
	.delete(isAuthenticatedUser, deleteProductReview);

module.exports = router;
