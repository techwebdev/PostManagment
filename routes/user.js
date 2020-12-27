var express = require("express");
var router = express.Router();
const app = express();

// Controllers
const userController = require("../controllers/user");

/* GET Login page. */
router.get("/login", userController.getLogin);

/* GET Signup page. */
router.get("/signup", userController.getSignup);

/* POST Login  */
router.post("/login", userController.postLogin);

/* POST Signup */
router.post("/signup", userController.postSignUp);

/** Logout */
router.get("/logout", userController.logout);

module.exports = router;
