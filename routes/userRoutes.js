const router = require("express").Router();
const { RegisterUser } = require("../controllers/userController");

router.route("/register").post(RegisterUser);

module.exports = router;
