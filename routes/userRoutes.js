const router = require("express").Router();

const {
	RegisterUser,
	loginUser,
	logout,
	forgotPassword,
	resetPassword,
	getUserDetails,
	updateUserPassword,
	updateProfile,
	getUser,
	getAllUsers,
	deleteUser,
	updateRole,
} = require("../controllers/userController");

const { isAuthenticatedUser, authorizedRoles } = require("../middlewares/auth");

router.route("/register").post(RegisterUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/password/update").put(isAuthenticatedUser, updateUserPassword);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
router
	.route("/admin/users")
	.get(isAuthenticatedUser, authorizedRoles("admin"), getAllUsers);

router
	.route("/admin/user/:id")
	.get(isAuthenticatedUser, authorizedRoles("admin"), getUser)
	.put(isAuthenticatedUser, authorizedRoles("admin"), updateRole)
	.delete(isAuthenticatedUser, authorizedRoles("admin"), deleteUser);

module.exports = router;
