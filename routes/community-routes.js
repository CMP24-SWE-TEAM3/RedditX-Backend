const express = require("express");
const communityController = require("../controllers/community-controller");
const startUploadSinglePhoto = require("../utils/upload-single-photo");
const authCheck = require("../middlewares/auth-check");

const router = express.Router();

router.post(
  "/:subreddit/api/upload-sr-icon",
  authCheck,
  startUploadSinglePhoto,
  communityController.resizeCommunityIcon,
  communityController.uploadCommunityIcon
);

router.post(
  "/:subreddit/api/upload-sr-banner",
  authCheck,
  startUploadSinglePhoto,
  communityController.resizeCommunityBanner,
  communityController.uploadCommunityBanner
);

//router.get("/", communityController.getCommunities);

//router.post("/", authCheck, communityController.createCommunity);
router.post(
  "/set-suggested-sort",
  authCheck,
  communityController.setSuggestedSort
);
module.exports = router;
