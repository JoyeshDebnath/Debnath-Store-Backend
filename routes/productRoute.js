const router = require("express").Router();
const {
	getAllProducts,
	createProduct,
	updateProduct,
	deleteProduct,
	getProduct,
} = require("../controllers/productController");

router.route("/products").get(getAllProducts);
router.route("/product/new").post(createProduct);
router
	.route("/product/:id")
	.put(updateProduct)
	.get(getProduct)
	.delete(deleteProduct);

module.exports = router;
