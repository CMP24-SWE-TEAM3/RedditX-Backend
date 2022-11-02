const express = require("express");
const userController = require("../controllers/user-controller");
const startUploadSinglePhoto = require("../utils/upload-single-photo");
//const authController = require('../controllers/authController');

const router = express.Router();

router.post(
  "/upload-user-photo",
  /*authController.protect,*/
  startUploadSinglePhoto,
  userController.resizeUserPhoto,
  userController.uploadUserPhoto
);

module.exports = router;
