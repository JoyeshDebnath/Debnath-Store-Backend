const router = require("express").Router();

const {
	RegisterUser,
	loginUser,
	logout,
	forgotPassword,
	resetPassword,
} = require("../controllers/userController");

router.route("/register").post(RegisterUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logout);

module.exports = router;
