const express = require("express");
const authController=require('../controllers/auth-controller');

const router = express.Router();



router.get(
    "/available-username/:username",
    authController.availableUsername,
  
  );
router.post("/signup",authController.signup);
router.post("/login",authController.login);
module.exports = router;
  
