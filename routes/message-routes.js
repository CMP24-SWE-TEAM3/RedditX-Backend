const express = require("express");
const messageController=require("../controllers/message-controller");
const authCheck = require("../middlewares/auth-check");

const router = express.Router();

router.post("/compose",authCheck ,messageController.compose);


router.post("/del",authCheck ,messageController.deleteMessage);
router.post("/unread",authCheck ,messageController.unreadMessage);


router.get("/sent",authCheck ,messageController.sentMessages);
router.get("/inbox",authCheck ,messageController.inboxMessages);
router.get("/all",authCheck ,messageController.allMessages);
router.post("/read-all-messages",authCheck ,messageController.readAllMessages);

module.exports = router;
