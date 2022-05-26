const router = require("express").Router();
const {
	RegisterUser,
	loginUser,
	logout,
} = require("../controllers/userController");

router.route("/register").post(RegisterUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
module.exports = router;
