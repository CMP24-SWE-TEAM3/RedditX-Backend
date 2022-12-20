const catchAsync = require("../utils/catch-async");
const AppError = require("../utils/app-error");
const Post = require("./../models/post-model");
const Comment = require("./../models/comment-model");
const Community = require("./../models/community-model");
const User = require("./../models/user-model");
const CommunityService = require("./../services/community-service");
const CommentService = require("./../services/comment-service");
const PostService = require("./../services/post-service");
const UserService = require("./../services/user-service");
const IdValidator = require("../validate/listing-validators").validateObjectId;

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
  var icon = undefined;
  try {
    icon = await communityServiceInstance.uploadCommunityPhoto(
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
    icon,
  });
});

/**
 * Saves filename to database
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const uploadCommunityBanner = catchAsync(async (req, res, next) => {
  var banner = undefined;
  try {
    banner = await communityServiceInstance.uploadCommunityPhoto(
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
    banner,
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
 * Get edited posts and comments within a community
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const getEdited = catchAsync(async (req, res, next) => {
  var posts = undefined;
  var comments = undefined;
  try {
    const subreddit = await communityServiceInstance.getOne({
      _id: req.params.subreddit,
      select: "moderators",
    });
    if (!subreddit)
      return next(new AppError("This subreddit doesn't exist!", 404));
    if (!subreddit.moderators.find((el) => el.userID))
      return next(
        new AppError("You are not a moderator in this subreddit!", 400)
      );
    posts = await postServiceInstance.getAll(
      { communityID: req.params.subreddit, editedAt: { $exists: true } },
      { sort: "-editedAt -createdAt" }
    );
    comments = await commentServiceInstance.getAll(
      { communityID: req.params.subreddit, editedAt: { $exists: true } },
      { sort: "-editedAt -createdAt" }
    );
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    posts,
    comments,
  });
});

/**
 * Get spammed posts and comments within a community
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const getSpammed = catchAsync(async (req, res, next) => {
  var posts = undefined;
  var comments = undefined;
  try {
    const subreddit = await communityServiceInstance.getOne({
      _id: req.params.subreddit,
      select: "moderators",
    });
    if (!subreddit)
      return next(new AppError("This subreddit doesn't exist!", 404));
    if (!subreddit.moderators.find((el) => el.userID))
      return next(
        new AppError("You are not a moderator in this subreddit!", 400)
      );
    posts = await postServiceInstance.getAll(
      {
        communityID: req.params.subreddit,
        spammers: { $exists: true, $ne: [] },
      },
      { sort: "-createdAt" }
    );
    comments = await commentServiceInstance.getAll(
      { communityID: req.params.subreddit, spams: { $exists: true, $ne: [] } },
      { sort: "-createdAt" }
    );
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    posts,
    comments,
  });
});

/**
 * Get all moderators of a subreddit
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const getModerators = catchAsync(async (req, res, next) => {
  var usersReturned = undefined;
  var users = [];
  try {
    const { moderatorIDs, creatorID } =
      await communityServiceInstance.getModerators(req.params.subreddit);
    usersReturned = await userServiceInstance.find(
      {
        _id: { $in: moderatorIDs },
      },
      "avatar about"
    );
    var temp = undefined;
    usersReturned.forEach((el, index) => {
      temp = { ...el }._doc;
      if (el._id === creatorID) temp.role = "creator";
      else temp.role = "moderator";
      users[index] = temp;
    });
    console.log(users);
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
      if (temp === undefined) temp = {};
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
 * Create subreddit
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const createSubreddit = async (req, res) => {
  console.log(req.body);
  const check=await communityServiceInstance.creationValidation(req.body);
  console.log(check);
  if (!check) {
    return res.status(500).json({
      status: "invalid parameters",
    });
  }
  var user = await userServiceInstance.getOne({ _id: req.username });
  
  const result = await communityServiceInstance.createSubreddit(req.body, user);
  const updateUser=await userServiceInstance.addUserToComm(user,req.body.name);
  if (!result.status||!updateUser.status) {
    return res.status(500).json({
      status: result.error,
    });
  }
  return res.status(200).json({
    status: result.response,
  });
};
/**
 * Add community rule
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const addCommunityRule = async (req, res) => {
  console.log(req.body);
  if (!req.body.srName || !req.body.rule) {
    return res.status(500).json({
      status: "invalid parameters",
    });
  }
  var user = await userServiceInstance.getOne({ _id: req.username });

  const result = await communityServiceInstance.addCommunityRule(
    req.body,
    user
  );
  console.log(result);
  if (!result.status) {
    return res.status(500).json({
      status: result.error,
    });
  }
  return res.status(200).json({
    status: result.response,
    id: result.id,
  });
};

/**
 * Edit community rule
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const editCommunityRule = async (req, res) => {
  if (
    !req.body.srName ||
    !req.body.rule ||
    !req.body.rule.id ||
    !IdValidator(req.body.rule.id)
  ) {
    return res.status(500).json({
      status: "invalid parameters",
    });
  }
  var user = await userServiceInstance.getOne({ _id: req.username });

  const result = await communityServiceInstance.editCommunityRule(
    req.body,
    user
  );
  console.log(result);
  if (!result.status) {
    return res.status(500).json({
      status: result.error,
    });
  }
  return res.status(200).json({
    status: result.response,
  });
};

/**
 * Get community about
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const getCommunityAbout = async (req, res) => {
  console.log(req.params);
  if (!req.params["subreddit"]) {
    return res.status(500).json({
      status: "invalid parameters",
    });
  }

  const result = await communityServiceInstance.availableSubreddit(
    req.params["subreddit"]
  );
  console.log(result);
  if (result.status) {
    return res.status(500).json({
      status: result.error,
    });
  }
  return res.status(200).json({
    status: "done",
    communityRules: result.subreddit.communityRules,
    moderators: result.subreddit.moderators,
  });
};

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

/**
 * Kick a user within a community
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const kickUser = catchAsync(async (req, res, next) => {
  var community = undefined;
  try {
    community = await communityServiceInstance.kickAtCommunity(
      req.params.subreddit,
      req.username,
      req.body.userID
    );
    const toBeKicked = await userServiceInstance.getOne({
      _id: req.body.userID,
      select: "member",
    });
    await communityServiceInstance.kickAtUser(toBeKicked, community);
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    message: "Operation is done successfully",
  });
});

const removeSrBanner = catchAsync(async (req, res) => {
  // [1] -> check existence of subreddit
  const subreddit = await communityServiceInstance.availableSubreddit(
    req.params.subreddit
  );
  if (subreddit.state) {
    return res.status(404).json({
      status: "failed",
      message: "not found this subreddit",
    });
  }
  // [2] -> check if user isn't moderator in subreddit
  if (
    !(await userServiceInstance.isModeratorInSubreddit(
      req.params.subreddit,
      req.username
    ))
  ) {
    return res.status(400).json({
      status: "failed",
      message: "you aren't moderator in this subreddit",
    });
  }
  await communityServiceInstance.removeSrBanner(req.params.subreddit);
  res.status(200).json({
    status: "succeded",
  });
});

const removeSrIcon = catchAsync(async (req, res) => {
  // [1] -> check existence of subreddit
  const subreddit = await communityServiceInstance.availableSubreddit(
    req.params.subreddit
  );
  if (subreddit.state) {
    return res.status(404).json({
      status: "failed",
      message: "not found this subreddit",
    });
  }
  // [2] -> check if user isn't moderator in subreddit
  if (
    !(await userServiceInstance.isModeratorInSubreddit(
      req.params.subreddit,
      req.username
    ))
  ) {
    return res.status(400).json({
      status: "failed",
      message: "you aren't moderator in this subreddit",
    });
  }
  await communityServiceInstance.removeSrIcon(req.params.subreddit);
  res.status(200).json({
    status: "succeded",
  });
});

const getFlairs = catchAsync(async (req, res) => {
  // [1] -> check existence of subreddit
  const subreddit = await communityServiceInstance.availableSubreddit(
    req.params.subreddit
  );
  if (subreddit.state) {
    return res.status(404).json({
      status: "failed",
      message: "not found this subreddit",
    });
  }
  //   // [2] -> check if user isn't moderator in subreddit
  //   if (!await userServiceInstance.isModeratorInSubreddit(req.params.subreddit, req.username)) {
  //     return res.status(400).json({
  //       status: 'failed',
  //       message: 'you aren\'t moderator in this subreddit',
  //     });
  //   }
  //[3]-> get the flairs list

  const flairs = await communityServiceInstance.getOne({
    _id: req.params.subreddit,
    select: "-_id flairList",
  });
  res.status(200).json({
    status: "succeeded",
    flairs: flairs.flairList,
  });
});

const deleteFlair = catchAsync(async (req, res) => {
  // [1] -> check existence of subreddit
  const subreddit = await communityServiceInstance.availableSubreddit(
    req.params.subreddit
  );
  if (subreddit.state) {
    return res.status(404).json({
      status: "failed",
      message: "not found this subreddit",
    });
  }
  // [2] -> check if user isn't moderator in subreddit
  if (
    !(await userServiceInstance.isModeratorInSubreddit(
      req.params.subreddit,
      req.username
    ))
  ) {
    return res.status(400).json({
      status: "failed",
      message: "you aren't moderator in this subreddit",
    });
  }
  //[3]-> delete the flair
  await communityServiceInstance.updateOne(
    { _id: req.params.subreddit },
    {
      $pull: {
        flairList: { _id: req.body.id },
      },
    }
  );
  res.status(200).json({
    status: "succeeded",
  });
});

const addFlair = catchAsync(async (req, res) => {
  // [1] -> check existence of subreddit
  const subreddit = await communityServiceInstance.availableSubreddit(
    req.params.subreddit
  );
  if (subreddit.state) {
    return res.status(404).json({
      status: "failed",
      message: "not found this subreddit",
    });
  }
  // [2] -> check if user isn't moderator in subreddit
  if (
    !(await userServiceInstance.isModeratorInSubreddit(
      req.params.subreddit,
      req.username
    ))
  ) {
    return res.status(400).json({
      status: "failed",
      message: "you aren't moderator in this subreddit",
    });
  }
  //[3]-> adding flair
  communityServiceInstance.updateOne(
    { _id: req.params.subreddit },
    {
      $push: {
        flairList: req.body,
      },
    }
  );
  return res.status(200).json({
    status: "succeeded",
  });
});

/**
 * Remove a spam from a post or a comment
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const removeSpam = catchAsync(async (req, res, next) => {
  if (!req.body.linkID)
    return next(new AppError("No linkID is provided!", 400));
  try {
    if (req.body.linkID[1] === "3") {
      // From a post
      var post = await postServiceInstance.getOne({
        _id: req.body.linkID.slice(3),
        select: "spammers",
      });
      console.log(post);
      if (!post) return new AppError("This post doesn't exist!", 404);
      const subreddit = await communityServiceInstance.getOne({
        _id: req.params.subreddit,
        select: "moderators",
      });
      if (!subreddit)
        return next(new AppError("This subreddit doesn't exist!", 404));
      if (!subreddit.moderators.find((el) => el.userID))
        return next(
          new AppError("You are not a moderator in this subreddit!", 400)
        );
      await communityServiceInstance.removeSpam(
        post,
        req.body.spamID,
        "spammers"
      );
    } else {
      // From a comment
      var comment = await commentServiceInstance.getOne({
        _id: req.body.linkID.slice(3),
      });
      if (!comment)
        return next(new AppError("This comment doesn't exist!", 404));
      const subreddit = await communityServiceInstance.getOne({
        _id: req.params.subreddit,
        select: "moderators",
      });
      if (!subreddit)
        return next(new AppError("This subreddit doesn't exist!", 404));
      if (!subreddit.moderators.find((el) => el.userID))
        return next(
          new AppError("You are not a moderator in this subreddit!", 400)
        );
      await communityServiceInstance.removeSpam(
        comment,
        req.body.spamID,
        "spams"
      );
    }
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    message: "Spams are updated successfully",
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
  getEdited,
  getModerators,
  getMembers,
  getCommunityOptions,
  getRandomCommunities,
  removeSrBanner,
  removeSrIcon,
  getFlairs,
  deleteFlair,
  addFlair,
  addCommunityRule,
  createSubreddit,
  editCommunityRule,
  getCommunityAbout,
  getGeneralInfo,
  getMembersCountPerDay,
  getViewsCountPerDay,
  kickUser,
  getSpammed,
  removeSpam,
};
