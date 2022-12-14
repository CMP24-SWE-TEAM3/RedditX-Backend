const catchAsync = require("../utils/catch-async");
const Community = require("./../models/community-model");
const User = require("./../models/user-model");
const CommunityService = require("./../services/community-service");
const UserService = require("./../services/user-service");

const communityServiceInstance = new CommunityService(Community);
const userServiceInstance = new UserService(User);

/**
 * Saves filename to database
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const uploadCommunityIcon = catchAsync(async (req, res, next) => {
  try {
    await communityServiceInstance.uploadCommunityPhoto(
      req.file,
      req.username,
      req.params.subreddit,
      "icon"
    );
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    message: "Icon is updated successfully",
  });
});

/**
 * Saves filename to database
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const uploadCommunityBanner = catchAsync(async (req, res, next) => {
  try {
    await communityServiceInstance.uploadCommunityPhoto(
      req.file,
      req.username,
      req.params.subreddit,
      "banner"
    );
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    message: "Banner is updated successfully",
  });
});

/**
 * Set suggested comment sort of a subreddit (srName and suggestedCommentSort must be sent in request body)
 * @param {Object} req request must contain srName and suggested comment sort
 * @param {Object} res
 * @returns {object} status
 */
const setSuggestedSort = async (req, res) => {
  if (req.body.srName.substring(0, 2) !== "t5") {
    return res.status(500).json({
      status: "failed",
    });
  }
  const result = communityServiceInstance.setSuggestedSort(req.body.srName, req.body.setSuggestedSort);
  if (result.status) {
    return res.status(200).json({
      status: "done"
    })
  }
  return res.status(500).json({
    status: "failed"
  })

};

/**
 * Get the list of communities that the user moderates them
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const getModerates = catchAsync(async (req, res, next) => {
  var communities = undefined;
  try {
    const user = await userServiceInstance.getOne({
      _id: req.username,
      select: "moderators",
    });
    communities = await communityServiceInstance.getCommunities(
      user,
      "moderators"
    );
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    communities,
  });
});

/**
 * Get the list of communities that the user subscribes to them
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const getSubscribed = catchAsync(async (req, res, next) => {
  var communities = undefined;
  try {
    const user = await userServiceInstance.getOne({
      _id: req.username,
      select: "member",
    });
    communities = await communityServiceInstance.getCommunities(user, "member");
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    communities,
  });
});
/**
 * Get the list of random communities 
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const getRandomCommunities = async (req, res) => {
  const communities = await communityServiceInstance.getRandomCommunities();
  return res.status(200).json({
    communities: communities
  });

}

/**
 * Ban or mute a user within a community
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const banOrMute = catchAsync(async (req, res, next) => {
  var community = undefined;
  try {
    community = await communityServiceInstance.banOrMuteAtCommunity(
      req.params.subreddit,
      req.username,
      req.body.userID,
      req.body.operation
    );
    const toBeAffected = await userServiceInstance.getOne({
      _id: req.body.userID,
      select: "member",
    });
    await communityServiceInstance.banOrMuteAtUser(
      toBeAffected,
      community,
      req.body.operation
    );
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    message: "Operation is done successfully",
  });
});

/**
 * Get all banned users within a community
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const getBanned = catchAsync(async (req, res, next) => {
  var users = undefined;
  try {
    const memberIDs = await communityServiceInstance.getBannedOrMuted(
      req.params.subreddit,
      "isBanned"
    );
    users = await userServiceInstance.find(
      {
        _id: { $in: memberIDs },
      },
      "avatar about"
    );
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    users,
  });
});

/**
 * Get all muted users within a community
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const getMuted = catchAsync(async (req, res, next) => {
  var users = undefined;
  try {
    const memberIDs = await communityServiceInstance.getBannedOrMuted(
      req.params.subreddit,
      "isMuted"
    );
    users = await userServiceInstance.find(
      {
        _id: { $in: memberIDs },
      },
      "avatar about"
    );
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    users,
  });
});

/**
 * Get all moderators of a subreddit
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const getModerators = catchAsync(async (req, res, next) => {
  var users = undefined;
  try {
    const moderatorIDs = await communityServiceInstance.getModerators(
      req.params.subreddit
    );
    users = await userServiceInstance.find(
      {
        _id: { $in: moderatorIDs },
      },
      "avatar about"
    );
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    users,
  });
});

/**
 * Get community options of a subreddit
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const getCommunityOptions = catchAsync(async (req, res, next) => {
  var communityOptions = undefined;
  try {
    communityOptions = await communityServiceInstance.getCommunityOptions(
      req.params.subreddit
    );
  } catch (err) {
    return next(err);
  }
  res.status(200).json(communityOptions);
});

const muteOrBanUser = catchAsync(async (req, res, next) => {
  const moderator = req.username;
  const mutedUser = req.body.userID;
  const subreddit = req.params.subreddit;
  // [1] -> check existence of subreddit
  subreddit = await communityServiceInstance.availableSubreddit(req.params.subreddit);
  if (!subreddit.state) {
    return res.status(404).json({
      status: 'failed',
      message: 'not found this subreddit',
    })
  }
  // [2] -> check if user isn't moderator in subreddit
  if (!await userServiceInstance.isModeratorInSubreddit(subreddit, req.username)) {
    return res.status(400).json({
      status: 'failed',
      message: 'you aren\'t moderator in this subreddit',
    });
  }
  // [2] -> check if the passed user is a participant in this subreddit if not then this is bad request
  if (!await userServiceInstance.isParticipantInSubreddit(subreddit, mutedUser)) {
    return res.status(400).json({
      status: 'failed',
      message: 'the user isn\'t in subreddit',
    });
  }
  // [3] -> do banning the user from subreddit
  await userServiceInstance.muteOrBanUserInSubreddit(subreddit, mutedUser, 'mute');
  return res.status(200).json({
    status: 'succeded',
  });
});

const removeSrBanner = catchAsync(async (req, res, next) => {
  // [1] -> check existence of subreddit
  subreddit = await communityServiceInstance.availableSubreddit(req.params.subreddit);
  if (subreddit.state) {
    return res.status(404).json({
      status: 'failed',
      message: 'not found this subreddit',
    })
  }
  // [2] -> check if user isn't moderator in subreddit
  if (!await userServiceInstance.isModeratorInSubreddit(req.params.subreddit, req.username)) {
    return res.status(400).json({
      status: 'failed',
      message: 'you aren\'t moderator in this subreddit',
    });
  }
  await communityServiceInstance.removeSrBanner(req.params.subreddit);
  res.status(200).json({
    status: 'succeded',
  });
})

const removeSrIcon = catchAsync(async (req, res, next) => {
  // [1] -> check existence of subreddit
  subreddit = await communityServiceInstance.availableSubreddit(req.params.subreddit);
  if (subreddit.state) {
    return res.status(404).json({
      status: 'failed',
      message: 'not found this subreddit',
    })
  }
  // [2] -> check if user isn't moderator in subreddit
  if (!await userServiceInstance.isModeratorInSubreddit(req.params.subreddit, req.username)) {
    return res.status(400).json({
      status: 'failed',
      message: 'you aren\'t moderator in this subreddit',
    });
  }
  await communityServiceInstance.removeSrIcon(req.params.subreddit);
  res.status(200).json({
    status: 'succeded',
  });
});

const getFlairs = catchAsync(async (req, res, next) => {
  // [1] -> check existence of subreddit
  subreddit = await communityServiceInstance.availableSubreddit(req.params.subreddit);
  if (subreddit.state) {
    return res.status(404).json({
      status: 'failed',
      message: 'not found this subreddit',
    })
  }
  // [2] -> check if user isn't moderator in subreddit
  if (!await userServiceInstance.isModeratorInSubreddit(req.params.subreddit, req.username)) {
    return res.status(400).json({
      status: 'failed',
      message: 'you aren\'t moderator in this subreddit',
    });
  }
  //[3]-> get the flairs list

  flairs = await communityServiceInstance.getOne({ '_id': req.params.subreddit, 'select': '-_id flairList' });
  res.status(200).json({
    status: 'succeeded',
    flairs: flairs.flairList,
  })
});

const deleteFlair = catchAsync(async (req, res, next) => {
  // [1] -> check existence of subreddit
  subreddit = await communityServiceInstance.availableSubreddit(req.params.subreddit);
  if (subreddit.state) {
    return res.status(404).json({
      status: 'failed',
      message: 'not found this subreddit',
    })
  }
  // [2] -> check if user isn't moderator in subreddit
  if (!await userServiceInstance.isModeratorInSubreddit(req.params.subreddit, req.username)) {
    return res.status(400).json({
      status: 'failed',
      message: 'you aren\'t moderator in this subreddit',
    });
  }
  //[3]-> delete the flair
  await communityServiceInstance.updateOne({ '_id': req.params.subreddit }, {
    $pull: {
      flairList: { '_id': req.body.id }
    }
  });
  res.status(200).json({
    status: 'succeeded',
  });
});

const addFlair = catchAsync(async (req, res, next) => {
  // [1] -> check existence of subreddit
  subreddit = await communityServiceInstance.availableSubreddit(req.params.subreddit);
  if (subreddit.state) {
    return res.status(404).json({
      status: 'failed',
      message: 'not found this subreddit',
    })
  }
  // [2] -> check if user isn't moderator in subreddit
  if (!await userServiceInstance.isModeratorInSubreddit(req.params.subreddit, req.username)) {
    return res.status(400).json({
      status: 'failed',
      message: 'you aren\'t moderator in this subreddit',
    });
  }
  //[3]-> adding flair 
  communityServiceInstance.updateOne({ '_id': req.params.subreddit }, {
    $push: {
      'flairList': req.body
    }
  });
  return res.status(200).json({
    status: 'succeeded',
  });
})

module.exports = {
  uploadCommunityIcon,
  uploadCommunityBanner,
  setSuggestedSort,
  getModerates,
  getSubscribed,
  banOrMute,
  getBanned,
  getMuted,
  getModerators,
  getCommunityOptions,
  getRandomCommunities,
  muteOrBanUser,
  removeSrBanner,
  removeSrIcon,
  getFlairs,
  deleteFlair,
  addFlair,
};
