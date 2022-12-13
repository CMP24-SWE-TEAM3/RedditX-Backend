const express = require("express");
const communityController = require("../controllers/community-controller");
const startUploadSinglePhoto = require("../utils/upload-single-photo");
const resizeCommunityPhoto = require("./../middlewares/resize-community-photo");
const authCheck = require("../middlewares/auth-check");

const router = express.Router();

router.post(
  "/:subreddit/upload-sr-icon",
  authCheck,
  startUploadSinglePhoto,
  resizeCommunityPhoto.resizeCommunityIcon,
  communityController.uploadCommunityIcon
);
router.post(
  "/:subreddit/upload-sr-banner",
  authCheck,
  startUploadSinglePhoto,
  resizeCommunityPhoto.resizeCommunityBanner,
  communityController.uploadCommunityBanner
);

router.post(
  "/set-suggested-sort",
  authCheck,
  communityController.setSuggestedSort
);
router.get(
  "/random-category",
  authCheck,
  communityController.getRandomCommunities
);

router.post("/:subreddit/kick-member", authCheck, communityController.kickUser);

router.get("/info", authCheck, communityController.getGeneralInfo);

router.get("/mine/moderator", authCheck, communityController.getModerates);
router.get("/mine/subscriber", authCheck, communityController.getSubscribed);

router.post(
  "/:subreddit/about/banned",
  authCheck,
  communityController.banOrMute
);
router.get(
  "/:subreddit/about/banned",
  authCheck,
  communityController.getBanned
);
router.post(
  "/:subreddit/about/muted",
  authCheck,
  communityController.banOrMute
);
router.post(
  "/create-subreddit",
  authCheck,
  communityController.createSubreddit
);
router.post("/community-rule", authCheck, communityController.addCommunityRule);
router.post(
  "/edit-community-rule",
  authCheck,
  communityController.editCommunityRule
);
router.get("/:subreddit/about/muted", authCheck, communityController.getMuted);
router.get(
  "/:subreddit/about/moderators",
  authCheck,
  communityController.getModerators
);
router.get(
  "/:subreddit/about/members",
  authCheck,
  communityController.getMembers
);
router.get(
  "/:subreddit/about/edit",
  authCheck,
  communityController.getCommunityOptions
);
router.get(
  "/:subreddit/members-count",
  authCheck,
  communityController.getMembersCountPerDay
);
router.get(
  "/:subreddit/page-views",
  authCheck,
  communityController.getViewsCountPerDay
);

router.get("/:subreddit", communityController.getCommunityAbout);

module.exports = router;
