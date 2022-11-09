const express = require("express");
const userController = require("../controllers/user-controller");
const startUploadSinglePhoto = require("../utils/upload-single-photo");
const authCheck = require("../middlewares/auth-check");

const router = express.Router();

router.post(
  "/upload-user-photo",
  authCheck,
  startUploadSinglePhoto,
  userController.resizeUserPhoto,
  userController.uploadUserPhoto
);

module.exports = router;
