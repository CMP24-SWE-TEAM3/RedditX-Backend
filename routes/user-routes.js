const express = require("express");
const userController = require("../controllers/user-controller");
const profileController = require("../controllers/profile-controller");
const startUploadSinglePhoto = require("../utils/upload-single-photo");
const authCheck = require("../middlewares/auth-check");
const resizeUserPhoto = require("../middlewares/resize-user-photo");
const possibleAuthCheck = require("../middlewares/possible-auth-check");

const router = express.Router();

router.post(
  "/me/upload-user-photo",
  authCheck,
  startUploadSinglePhoto,
  resizeUserPhoto,
  userController.uploadUserPhoto
);
router.get("/me/prefs", authCheck, userController.getUserPrefs);
router.get("/me", authCheck, userController.getUserMe);

router.get("/:username/about", userController.getUserAbout);

router.post("/block-user", authCheck, userController.block);
router.post("/spam", authCheck, userController.spam);

router.post("/updateEmail", possibleAuthCheck, userController.updateEmail);

router.get("/comment/:username", profileController.getUserComments);
router.get("/submitted/:username", profileController.getUserSubmitted);
router.get("/overview/:username", profileController.getUserOverview);
router.get("/upvoted/:username", profileController.getUserUpVoted);
router.get("/downvoted/:username", profileController.getUserDownVoted);


router.get("/userMentions/:username", profileController.getUserMentions);
router.get("/userCommentReplies/:username", profileController.getUserCommentReplies);
router.get("/userSelfReply/:username", profileController.getUserSelfReply);

module.exports = router;
