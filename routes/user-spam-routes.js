const express = require("express");
const userController = require("../controllers/user-controller");
//const authController = require('../controllers/authController');

const router = express.Router();

router.post(
  "/",
  /*authController.protect,*/
  userController.spam
);

module.exports = router;
