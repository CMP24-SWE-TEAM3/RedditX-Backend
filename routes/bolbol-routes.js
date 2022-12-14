const express = require("express");
const listingController = require("./../controllers/listing-controller");
const userController = require("./../controllers/user-controller");
const communityController = require("./../controllers/community-controller");
const commentController = require("./../controllers/comment-controller");
const authCheck = require("./../middlewares/auth-check");
const addMute = require("../middlewares/add-mute-ban").addMute;
const addBan = require("../middlewares/add-mute-ban").addBan;

const router = express.Router();

router
    .route('/api/friend')
    .post(authCheck, userController.friendRequest);
router
    .route('/api/approve')
    .post(authCheck);

module.exports = router;