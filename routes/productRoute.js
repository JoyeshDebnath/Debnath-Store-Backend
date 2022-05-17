const router = require("express").Router();
const {
	getAllProducts,
	createProduct,
	updateProduct,
	deleteProduct,
} = require("../controllers/productController");

router.route("/products").get(getAllProducts);
router.route("/product/new").post(createProduct);
router.route("/product/:id").put(updateProduct);
router.route("/product/:id").delete(deleteProduct);
module.exports = router;
