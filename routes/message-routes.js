const express = require("express");
const messageController=require("../controllers/message-controller");
const authCheck = require("../middlewares/auth-check");

const router = express.Router();

router.post("/compose",authCheck ,messageController.compose);


module.exports = router;
