const express = require('express');
const searchController = require('./../controllers/search-controller');
const addSubreddit = require('./../middlewares/append-subreddit');

const router = express.Router();

router
    .route('/r/:subreddit')
    .get(addSubreddit, searchController.getSearchResults);

router
    .route('/r')
    .get(searchController.getSearchResults);



module.exports = router;