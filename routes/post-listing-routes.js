const express = require('express');
const postController = require('../controllers/post-controller');
const possibleAuthCheck = require('../middlewares/possible-auth-check');

const router = express.Router();


router.route('/:subreddit/:criteria')
    .get(
        possibleAuthCheck,
        postController.addSubreddit,
        postController.getPosts
    );

router.route('/:criteria')
    .get(
        possibleAuthCheck,
        postController.getPosts
    );

module.exports = router;