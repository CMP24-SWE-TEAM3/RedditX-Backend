const express = require("express");
const communityController = require("../controllers/community-controller");
const startUploadSinglePhoto = require("../utils/upload-single-photo");
//const authController = require('../controllers/authController');

const router = express.Router();

router.post(
  "/:subreddit/api/upload-sr-icon",
  /*authController.protect,*/
  startUploadSinglePhoto,
  communityController.resizeCommunityIcon,
  communityController.uploadCommunityIcon
);

router.post(
  "/:subreddit/api/upload-sr-banner",
  /*authController.protect,*/
  startUploadSinglePhoto,
  communityController.resizeCommunityBanner,
  communityController.uploadCommunityBanner
);
router.post(
  '/set-suggested-sort',
  //auth-check,
  communityController.setSuggestedSort

);
module.exports = router;
