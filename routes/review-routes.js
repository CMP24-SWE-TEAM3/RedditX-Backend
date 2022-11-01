const express = require("express");
const reviewController = require("../controllers/reviewController");
const router = express.Router({ mergeParams: true });

//router.use(authController.protect);
router.route("/").get(reviewController.getAllReviews);
module.exports = router;
