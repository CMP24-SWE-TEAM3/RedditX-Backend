const catchAsync = require("../utils/catch-async");
const Community = require("./../models/community-model");
const Comment = require("./../models/comment-model");
const Post = require("./../models/post-model");
const User = require("./../models/user-model");
const CommunityService = require("./../services/community-service");
const CommentService = require("./../services/comment-service");
const PostService = require("./../services/post-service");
const UserService = require("./../services/user-service");

const communityServiceInstance = new CommunityService(Community);
const commentServiceInstance = new CommentService(Comment);
const postServiceInstance = new PostService(Post);
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
  const result = communityServiceInstance.setSuggestedSort(
    req.body.srName,
    req.body.setSuggestedSort
  );
  if (result.status) {
    return res.status(200).json({
      status: "done",
    });
  }
  return res.status(500).json({
    status: "failed",
  });
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
    communities: communities,
  });
};

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
  var banned = [];
  try {
    const { memberIDs, dates } =
      await communityServiceInstance.getBannedOrMuted(
        req.params.subreddit,
        "isBanned"
      );
    users = await userServiceInstance.find(
      {
        _id: { $in: memberIDs },
      },
      "avatar about"
    );
    dates.forEach((date, index) => {
      var tempBanned = { ...users[index] }._doc;
      tempBanned.date = date;
      banned[index] = tempBanned;
    });
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    users: banned,
  });
});

/**
 * Get all muted users within a community
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const getMuted = catchAsync(async (req, res, next) => {
  var users = undefined;
  var muted = [];
  try {
    const { memberIDs, dates } =
      await communityServiceInstance.getBannedOrMuted(
        req.params.subreddit,
        "isMuted"
      );
    users = await userServiceInstance.find(
      {
        _id: { $in: memberIDs },
      },
      "avatar about"
    );
    dates.forEach((date, index) => {
      var tempMuted = { ...users[index] }._doc;
      tempMuted.date = date;
      muted[index] = tempMuted;
    });
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    users: muted,
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
 * Get all members of a subreddit
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const getMembers = catchAsync(async (req, res, next) => {
  var users = undefined;
  var members = [];
  try {
    const { memberIDs, isBannedAndMuted } =
      await communityServiceInstance.getMembers(req.params.subreddit);
    users = await userServiceInstance.find(
      {
        _id: { $in: memberIDs },
      },
      "avatar about"
    );
    isBannedAndMuted.forEach((isBannedAndMutedElement, index) => {
      var temp = { ...users[index] }._doc;
      temp.isBanned = isBannedAndMutedElement.isBanned;
      temp.isMuted = isBannedAndMutedElement.isMuted;
      members[index] = temp;
    });
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    users: members,
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

/**
 * Get general information about things like a link, comment or a community
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const getGeneralInfo = catchAsync(async (req, res, next) => {
  var things = [];
  try {
    const thingsIDs = communityServiceInstance.getThingsIDs(req.query.id);
    var result;
    var prepend = undefined;
    for (var i = 0; i < thingsIDs.length; i++) {
      prepend = thingsIDs[i][1] * 1;
      result =
        prepend === 1 // t1_ => Comment
          ? await commentServiceInstance.getOne({ _id: thingsIDs[i].slice(3) })
          : prepend === 3 // t3_ => Post
          ? await postServiceInstance.getOne({ _id: thingsIDs[i].slice(3) })
          : prepend === 5 // t5_ => Community
          ? await communityServiceInstance.getOne({ _id: thingsIDs[i] })
          : undefined;
      things.push(result);
    }
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    things,
  });
});

/**
 * Get members count (joined or left) per day
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const getMembersCountPerDay = catchAsync(async (req, res, next) => {
  var data = [];
  try {
    data = await communityServiceInstance.getStats(
      req.params.subreddit,
      req.query.type
    );
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    data,
  });
});

/**
 * Get views count per day
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const getViewsCountPerDay = catchAsync(async (req, res, next) => {
  var data = [];
  try {
    data = await communityServiceInstance.getStats(
      req.params.subreddit,
      "pageViews"
    );
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    data,
  });
});

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
  getMembers,
  getCommunityOptions,
  getRandomCommunities,
  getGeneralInfo,
  getMembersCountPerDay,
  getViewsCountPerDay,
};
