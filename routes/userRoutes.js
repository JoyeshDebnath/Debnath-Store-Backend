const router = require("express").Router();
const { RegisterUser, loginUser } = require("../controllers/userController");

router.route("/register").post(RegisterUser);
router.route("/login").post(loginUser);

module.exports = router;
