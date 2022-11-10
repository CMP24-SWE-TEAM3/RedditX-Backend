const express = require("express");
const userController = require("../controllers/user-controller");
const authCheck = require("../middlewares/auth-check");

const router = express.Router();

router.post("/", authCheck, userController.block);

module.exports = router;
