const express = require("express");
const router = express.Router();
const pushNotification = require("../controllers/push-notification-controller");
router.post("/push", pushNotification.sendPushNotification);
module.exports = router;
