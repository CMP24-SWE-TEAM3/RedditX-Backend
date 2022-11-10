const express = require("express");
const commentController = require("../controllers/comment-controller");
const authCheck = require("../middlewares/auth-check");

const router = express.Router();

router.post("/vote", authCheck, commentController.vote);

module.exports = router;
