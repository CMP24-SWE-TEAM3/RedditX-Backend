const express = require("express");
const messageController=require("../controllers/message-controller");
const authCheck = require("../middlewares/auth-check");

const router = express.Router();

router.post("/compose",authCheck ,messageController.compose);


router.post("/del",authCheck ,messageController.deleteMessage);
router.post("/unread",authCheck ,messageController.unreadMessage);


router.get("/sent",authCheck ,messageController.sentMessages);
router.get("/inbox",authCheck ,messageController.inboxMessages);

module.exports = router;
