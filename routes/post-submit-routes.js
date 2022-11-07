const express = require("express");
const postController = require("../controllers/post-controller");

const router = express.Router();

router.post(
  "/",
  /*authController.protect,*/
  postController.uploadPostFiles,
  postController.submit
);

module.exports = router;
