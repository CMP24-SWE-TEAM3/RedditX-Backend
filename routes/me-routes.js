const express = require("express");
const meController=require('../controllers/me-controller');

const router = express.Router();

router.get("/about/:username",meController.getUserAbout);
router.get("/:username",meController.getUserMe);
router.get("/prefs/:username",meController.getUserPrefs);

module.exports = router;
  
