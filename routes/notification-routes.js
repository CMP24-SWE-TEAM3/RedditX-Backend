const express = require("express");
const notificationController = require("../controllers/notification-controller");
const authCheck = require("../middlewares/auth-check");

const router = express.Router();

router
  .route("/history")
  .get(authCheck, notificationController.getNotifications);

module.exports = router;
