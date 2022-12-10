const express = require("express");
const router = express.Router();
const pushNotification=require("../controllers/push-notification-controller");
router.get("/push",pushNotification.sendNotification);
module.exports = router;
