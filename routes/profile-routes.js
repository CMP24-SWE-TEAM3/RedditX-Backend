const express = require("express");
const profileController=require('../controllers/profile-controller');

const router = express.Router();

router.get("/comment/:username",profileController.getUserComments);
router.get("/submitted/:username",profileController.getUserSubmitted);
router.get("/overview/:username",profileController.getUserOverview);
router.get("/upvoted/:username",profileController.getUserUpVoted);
router.get("/downvoted/:username",profileController.getUserDownVoted);

module.exports = router;
  
