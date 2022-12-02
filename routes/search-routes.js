const express = require("express");
const searchController = require("./../controllers/search-controller");
const addSubreddit = require("./../middlewares/append-subreddit");
const possibleAuthCheck = require("./../middlewares/possible-auth-check");
const router = express.Router();

router
  .route("/r/:subreddit")
  .get(possibleAuthCheck, addSubreddit, searchController.getSearchResults);

router.route("/r").get(possibleAuthCheck, searchController.getSearchResults);

module.exports = router;
