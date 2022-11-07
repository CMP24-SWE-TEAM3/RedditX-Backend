const express = require("express");
const userController = require("../controllers/user-controller");
//const authController = require('../controllers/authController');

const router = express.Router();

router.post(
  "/",
  /*authController.protect,*/
  userController.block
);

module.exports = router;
