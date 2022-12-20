const express = require("express");
const userController = require("../controllers/user-controller");
const profileController = require("../controllers/profile-controller");
const startUploadSinglePhoto = require("../utils/upload-single-photo");
const authCheck = require("../middlewares/auth-check");
const resizeUserPhoto = require("../middlewares/resize-user-photo");

const router = express.Router();

router.post(
  "/me/upload-user-photo",
  authCheck,
  startUploadSinglePhoto,
  resizeUserPhoto,
  userController.uploadUserPhoto
);
router.get("/me/saved-posts", authCheck, userController.getUserSavedPosts);
router.get("/me/prefs", authCheck, userController.getUserPrefs);
router.patch("/me/prefs", authCheck, userController.editUserPrefs);
router.get("/me", authCheck, userController.getUserMe);
router.get("/:username/about", userController.getUserAbout);
router.get("/me/followers", authCheck, userController.followers);
router.get("/me/following", authCheck, userController.following);
router.get("/me/interests", authCheck, userController.getInterests);
router.post("/me/interests", authCheck, userController.addInterests);

router.post("/block-user", authCheck, userController.block);
router.post("/spam", authCheck, userController.spam);

router.post("/getFollowers", authCheck, userController.getFollowersOfUser);

router.patch("/update-email", authCheck, userController.updateEmail);
router.post("/edit-profile", authCheck, userController.editProfile);

router.get("/:username/comments", profileController.getUserComments);
router.get("/:username/submitted", profileController.getUserSubmitted);
router.get("/:username/overview", profileController.getUserOverview);
router.get("/:username/upvoted", profileController.getUserUpVoted);
router.get("/:username/downvoted", profileController.getUserDownVoted);

router.get("/get-user-mentions", authCheck, profileController.getUserMentions);

router.post("/subscribe", authCheck, userController.subscribe);
router.post("/update", authCheck, userController.updateInfo);

router.route("/me/friends").get(authCheck, userController.getAllFriends);

router
  .route("/me/friends/:username")
  .get(authCheck, userController.getUserInfo);

router.route("/friend").post(authCheck, userController.friendRequest);

router.route("/unfriend").post(authCheck, userController.unFriendRequest);
module.exports = router;
