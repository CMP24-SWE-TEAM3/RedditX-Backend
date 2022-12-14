const express = require("express");
const listingController = require("./../controllers/listing-controller");
const router = express.Router();

router
  .route("/insights_count/:post")
  .get(/*authCheck,*/ listingController.getPostInsights);

module.exports = router;
