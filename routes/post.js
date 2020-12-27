var express = require("express");
var router = express.Router();
// Controllers
const postController = require("../controllers/post");

/* GET home page. */
router.get("/", postController.getPost);

/**Get Add page */

router.get("/addpost", postController.getAddPost);

/** Post Add Post */
router.post("/addpost", postController.postAddPost);

/**Like Post */

router.get("/postlike/:id", postController.likePost);

module.exports = router;
