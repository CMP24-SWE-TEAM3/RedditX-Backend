const express = require("express");
const communityController = require("../controllers/community-controller");
const startUploadSinglePhoto = require("../utils/upload-single-photo");
const authCheck = require("../middlewares/auth-check");

const router = express.Router();

router.post(
  "/:subreddit/upload-sr-icon",
  authCheck,
  startUploadSinglePhoto,
  communityController.resizeCommunityIcon,
  communityController.uploadCommunityIcon
);
router.post(
  "/:subreddit/upload-sr-banner",
  authCheck,
  startUploadSinglePhoto,
  communityController.resizeCommunityBanner,
  communityController.uploadCommunityBanner
);

router.post(
  "/set-suggested-sort",
  authCheck,
  communityController.setSuggestedSort
);

router.get("/mine/moderator", authCheck, communityController.getModerates);
router.get("/mine/subscriber", authCheck, communityController.getSubscribed);

router.post("/:subreddit/about/banned", authCheck, communityController.ban);
router.get(
  "/:subreddit/about/banned",
  authCheck,
  communityController.getBanned
);
router.post("/:subreddit/about/muted", authCheck, communityController.mute);
router.get("/:subreddit/about/muted", authCheck, communityController.getMuted);
router.get(
  "/:subreddit/about/moderators",
  authCheck,
  communityController.getModerators
);
router.get(
  "/:subreddit/about/edit",
  authCheck,
  communityController.getCommunityOptions
);

module.exports = router;
