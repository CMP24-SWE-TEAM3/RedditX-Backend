const express = require("express");
const listingController = require("../controllers/listing-controller");
const commentController = require("../controllers/comment-controller");
const startUploadingFiles = require("../utils/upload-array-photos");
const possibleAuthCheck = require("../middlewares/possible-auth-check");
const authCheck = require("../middlewares/auth-check");
const addSubreddit = require("./../middlewares/append-subreddit");
const router = express.Router();

router.post("/follow-post", authCheck, listingController.followPost);
router
  .route("/posts/r/:subreddit/:criteria")
  .get(possibleAuthCheck, addSubreddit, listingController.getPosts);
router
  .route("/posts/:criteria")
  .get(possibleAuthCheck, listingController.getPosts);
router.post("/edit-user-text", authCheck, listingController.editUserText);
router.post("/addcomment", authCheck, listingController.addComment);
router.post("/addreply", authCheck, listingController.addReply);
router.post("/save", authCheck, listingController.save);
router.post("/unsave", authCheck, listingController.unsave);
router.post("/hide", authCheck, listingController.hide);
router.post("/unhide", authCheck, listingController.unhide);
router.post("/:subreddit/lock", authCheck, listingController.markLocked);
router.post("/:subreddit/unlock", authCheck, listingController.markUnLocked);
router.post("/del", authCheck, listingController.deleteLink);
router.post("/vote", authCheck, listingController.vote);
router.post(
  "/submit",
  authCheck,
  startUploadingFiles,
  listingController.submit
);
router.post("/:subreddit/mark-nsfw", authCheck, listingController.markNsfw);
router.post(
  "/:subreddit/unspoiler",
  authCheck,
  listingController.markUnSpoiler
);
router.post("/:subreddit/spoiler", authCheck, listingController.markSpoiler);

router.route("/show-comment").post(authCheck, commentController.showComment);

router
  .route("/insights-count/:post")
  .get(/*authCheck,*/ listingController.getPostInsights);

module.exports = router;
