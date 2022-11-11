const express = require("express");
const authController = require("../controllers/auth-controller");

const router = express.Router();

router.get("/username-available/", authController.availableUsername);
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/get-user-prefs/:username", authController.getUserPrefs);
module.exports = router;
