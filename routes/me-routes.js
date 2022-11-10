const express = require("express");
const meController=require('../controllers/me-controller');

const router = express.Router();

router.get("/api/v1/me/about/:username",meController.getUserAbout);
router.get("/api/v1/me/:username",meController.getUserMe);
router.get("/api/v1/me/prefs/:username",meController.getUserPrefs);

module.exports = router;
  
