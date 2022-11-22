const express = require("express");
const listingController = require("../controllers/listing-controller");
const possibleAuthCheck = require("../middlewares/possible-auth-check");
const authCheck = require("../middlewares/auth-check");
const addSubreddit = require('./../middlewares/append-subreddit');
const router = express.Router();

router
  .route("/posts/r/:subreddit/:criteria")
  .get(
    possibleAuthCheck,
    addSubreddit,
    listingController.getPosts
  );
router
  .route("/posts/:criteria")
  .get(possibleAuthCheck, listingController.getPosts);

router.post("/save", authCheck, listingController.save);
router.post("/unsave", authCheck, listingController.unsave);
router.post("/vote", authCheck, listingController.vote);
router.post(
  "/submit",
  authCheck,
  listingController.uploadPostFiles,
  listingController.submit
);

module.exports = router;
