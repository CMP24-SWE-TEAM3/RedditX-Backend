const express = require("express");
const postController = require("../controllers/post-controller");
const authCheck = require("../middlewares/auth-check");

const router = express.Router();

router.post(
  "/",
  authCheck,
  postController.uploadPostFiles,
  postController.submit
);

module.exports = router;
