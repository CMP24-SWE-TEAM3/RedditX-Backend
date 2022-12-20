const express = require("express");
const communityController = require("../controllers/community-controller");
const startUploadSinglePhoto = require("../utils/upload-single-photo");
const resizeCommunityPhoto = require("./../middlewares/resize-community-photo");
const authCheck = require("../middlewares/auth-check");

const userController = require("./../controllers/user-controller");

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

router.get(
  "/get-specific-category",
  authCheck,
  communityController.getSpecificCategory
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
router.get("/:subreddit/about/muted", authCheck, communityController.getMuted);
router.get(
  "/:subreddit/about/spammed",
  authCheck,
  communityController.getSpammed
);
router.patch(
  "/:subreddit/about/spammed",
  authCheck,
  communityController.removeSpam
);
router.get(
  "/:subreddit/about/edited",
  authCheck,
  communityController.getEdited
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
  communityController.getMembersCountPerDayAndMonth
);
router.get(
  "/:subreddit/page-views",
  authCheck,
  communityController.getViewsCountPerDayAndMonth
);

router
  .route("/:subreddit/api/flair-list")
  .get(authCheck, communityController.getFlairs);

router
  .route("/:subreddit/accept-moderator-invite")
  .post(authCheck, userController.acceptModeratorInvite);

router
  .route("/:subreddit/leave-moderator")
  .post(authCheck, userController.leaveModeratorOfSubredddit);

router
  .route("/:subreddit/delete-sr-banner")
  .post(authCheck, communityController.removeSrBanner);
router
  .route("/:subreddit/delete-sr-icon")
  .post(authCheck, communityController.removeSrIcon);

router
  .route("/:subreddit/api/flair-list")
  .get(authCheck, communityController.getFlairs);

router
  .route("/:subreddit/delete-flair")
  .post(authCheck, communityController.deleteFlair);

router.route("/:subreddit/flair").post(authCheck, communityController.addFlair);

router
  .route("/:subreddit/site-admin")
  .post(authCheck, communityController.configureSubreddit);

router.route("/approve").post(authCheck, communityController.approveLink);

router.route("/remove").post(authCheck, communityController.removeLink);

router
  .route("/:subreddit/kick-moderator")
  .post(authCheck, communityController.kickModerator);

router.get("/:subreddit", communityController.getCommunityAbout);

module.exports = router;
