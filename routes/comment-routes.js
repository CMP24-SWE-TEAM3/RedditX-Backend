const express = require("express");
const commentController=require('../controllers/comment-controller');

const router = express.Router();



router.post("/vote",
    //authcheck,
    commentController.vote
)

module.exports = router;
