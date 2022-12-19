const AppError = require("../utils/app-error");
const catchAsync = require("../utils/catch-async");
const User = require("./../models/user-model");
const Post = require("./../models/post-model");
const Comment = require("./../models/comment-model");
const Community = require("./../models/community-model");

const PostService = require("./../services/post-service");
const UserService = require("./../services/user-service");
const CommunityService = require("./../services/community-service");
const CommentService = require("./../services/comment-service");

const postServiceInstance = new PostService(Post);
const userServiceInstance = new UserService(User);
const communityServiceInstance = new CommunityService(Community);
const commentServiceInstance = new CommentService(Comment);

/**
 * Get user followers
 * @param {function} (req, res)
 * @returns {object} res
 */
const followers = async (req, res) => {
  console.log(req.username);
  if (!req.username) {
    return res.status(500).json({
      response: "error providing username",
    });
  }
  const result = await userServiceInstance.getFollowers(req.username);
  return res.status(200).json({
    response: "done",
    followers: result.followers,
  });
};
/**
 * Get user interests
 * @param {function} (req, res)
 * @returns {object} res
 */
const getInterests = async (req, res) => {
  console.log(req.username);
  if (!req.username) {
    return res.status(500).json({
      response: "error providing username",
    });
  }
  const result = await userServiceInstance.getInterests(req.username);

  if (result.status) {
    return res.status(200).json({
      response: "done",
      categories: result.categories,
    });
  } else {
    return res.status(500).json({
      response: "operation failed",
    });
  }
};

/**
 * Add user interests
 * @param {function} (req, res)
 * @returns {object} res
 */
const addInterests = async (req, res) => {
  console.log(req.username);
  if (!req.username || !req.body.categories) {
    return res.status(500).json({
      response: "error providing username",
    });
  }
  const result = await userServiceInstance.addInterests(
    req.username,
    req.body.categories
  );
  if (result.status) {
    return res.status(200).json({
      response: "done",
    });
  } else {
    return res.status(500).json({
      response: "operation failed",
    });
  }
};
/**
 * Update user prefs
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const editUserPrefs = catchAsync(async (req, res, next) => {
  var results = undefined;
  try {
    const user = await userServiceInstance.findById(req.username);
    if (user) {
      results = await userServiceInstance.updateOne(
        { numComments: req.body.numComments },
        { threadedMessages: req.body.threadedMessages },
        { showLinkFlair: req.body.showLinkFlair },
        { threadedMessages: req.body.threadedMessages },
        { countryCode: req.body.countryCode },
        { emailCommentReply: req.body.emailCommentReply },
        { emailUpvoteComment: req.body.emailUpvoteComment },
        { emailMessages: req.body.emailMessages },
        { emailUnsubscribeAll: req.body.emailUnsubscribeAll },
        { emailUpvotePost: req.body.emailUpvotePost },
        { emailUsernameMention: req.body.emailUsernameMention },
        { emailUserNewFollower: req.body.emailUserNewFollower },
        { emailPrivateMessage: req.body.emailPrivateMessage },
        { over18: req.body.over18 },
        { newwindow: req.body.newwindow },
        { labelNsfw: req.body.labelNsfw },
        { liveOrangeReds: req.body.liveOrangeReds },
        { markMessageRead: req.body.markMessageRead },
        { enableFollwers: req.body.enableFollwers },
        { publicVotes: req.body.publicVotes },
        {
          showLocationBasedRecommendations:
            req.body.showLocationBasedRecommendations,
        },
        { searchIncludeOver18: req.body.searchIncludeOver18 },
        { defaultCommentSort: req.body.defaultCommentSort },
        { langauge: req.body.langauge }
      );
    }
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    results,
  });
});

/**
 * Update user email
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const updateEmail = catchAsync(async (req, res, next) => {
  var results = undefined;
  try {
    const user = await userServiceInstance.findById(req.username);
    if (user) {
      results = await userServiceInstance.updateOne(
        { _id: req.username },
        { email: req.body.email }
      );
    }
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    results,
  });
});

/**
 * Saves filename to database
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const uploadUserPhoto = catchAsync(async (req, res, next) => {
  var avatar = undefined;
  try {
    avatar = await userServiceInstance.uploadUserPhoto(
      req.body.action,
      req.username,
      req.file
    );
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    avatar,
  });
});

/**
 * Blocks another user
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const block = catchAsync(async (req, res, next) => {
  try {
    await userServiceInstance.block(
      req.username,
      req.body.userID,
      req.body.action
    );
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    message: "Blocks are updated successfully",
  });
});

/**
 * Spams a post or a comment
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const spam = catchAsync(async (req, res, next) => {
  if (!req.body.linkID)
    return next(new AppError("No linkID is provided!", 400));
  var community = undefined;
  try {
    if (req.body.linkID[1] === "3") {
      // Spam a post
      const post = await postServiceInstance.getOne({
        _id: req.body.linkID.slice(3),
      });
      if (!post) return new AppError("This post doesn't exist!", 404);
      if (post.communityID !== undefined && post.communityID !== "")
        community = await communityServiceInstance.getOne({
          _id: post.communityID,
          select: "communityOptions",
        });
      await postServiceInstance.spamPost(
        post,
        req.body.spamType,
        req.body.spamText,
        req.username,
        community
      );
    } else {
      // Spam a comment
      var comment = await commentServiceInstance.getOne({
        _id: req.body.linkID.slice(3),
      });
      if (!comment)
        return next(new AppError("This comment doesn't exist!", 404));
      comment = await commentServiceInstance.spamComment(
        comment,
        req.body.spamType,
        req.body.spamText,
        req.username
      );
      community = await communityServiceInstance.getOne({
        _id: comment.communityID,
        select: "communityOptions",
      });
      await commentServiceInstance.saveSpammedComment(comment, community);
    }
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    message: "Spams are updated successfully",
  });
});

/**
 * Get posts where is saved by the user
 * @param {function} (req,res)
 * @returns {object} res
 */
const getUserSavedPosts = catchAsync(async (req, res, next) => {
  var posts = undefined;
  try {
    const user = await userServiceInstance.findById(req.username);
    posts = await userServiceInstance.userSavedPosts(user, req.query);
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    posts,
  });
});
/**
 * Get user prefs
 * @param {function} (req,res)
 * @returns {object} res
 */
const getUserPrefs = catchAsync(async (req, res, next) => {
  var prefs = undefined;
  try {
    prefs = await userServiceInstance.userPrefs(req.username);
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    prefs,
  });
});

/**
 * Get user about
 * @param {function} (req,res)
 * @returns {object} res
 */
const getUserAbout = catchAsync(async (req, res, next) => {
  var about = undefined;
  try {
    about = await userServiceInstance.userAbout(req.params.username);
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    about,
  });
});

/**
 * Get user me info
 * @param {function} (req,,res)
 * @returns {object} res
 */
const getUserMe = catchAsync(async (req, res, next) => {
  var meInfo = undefined;
  try {
    meInfo = await userServiceInstance.userMe(req.username);
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    meInfo,
  });
});

const returnResponse = (res, obj, statusCode) => {
  return res.status(statusCode).json(obj);
};

/**
 * Subscribe to a subreddit or a redditor
 * @param {function} (req,res)
 * @returns {object} res
 */
const subscribe = async (req, res) => {
  if (!req.body.srName || !req.body.action) {
    return returnResponse(res, { error: "invalid inputs" }, 400);
  }

  const result = await userServiceInstance.subscribe(req.body, req.username);
  if (result.state) {
    return res.status(200).json({
      status: "done",
    });
  } else {
    return res.status(404).json({
      status: result.error,
    });
  }
};

const friendRequest = catchAsync(async (req, res, next) => {
  if (req.body.type === 'friend') {
    userServiceInstance.addFriend(req.username, req.body.userID);
  } else if (req.body.type === 'moderator_invite') {
    //[1]-> check the existence of the moderator
    subreddit = await communityServiceInstance.availableSubreddit(req.body.communityID);
    if (subreddit.state) {
      return res.status(404).json({
        status: 'failed',
        message: 'not found this subreddit',
      })
    }
    // [2] -> check if user isn't moderator in subreddit
    if (!await userServiceInstance.isModeratorInSubreddit(req.body.communityID, req.username)) {
      return res.status(400).json({
        status: 'failed',
        message: 'you aren\'t moderator in this subreddit',
      });
    }
    //check that invited moderator isn't moderator
    if (await userServiceInstance.isModeratorInSubreddit(req.body.communityID, req.body.userID)) {
      return res.status(400).json({
        status: 'failed',
        message: 'this user is already moderator',
      });
    }
    await communityServiceInstance.inviteModerator(req.body.communityID, req.body.userID);
  } else {
    return res.status(400).json({
      status: "failed",
      message: "invalid type"
    })
  }
  return res.status(200).json({
    status: "succeeded",
  });
});

const unFriendRequest = catchAsync(async (req, res, next) => {
  if (req.body.type === 'friend') {
    userServiceInstance.deleteFriend(req.username, req.body.userID);
  } else if (req.body.type === 'moderator_deinvite') {
    //[1]-> check the existence of the moderator
    subreddit = await communityServiceInstance.availableSubreddit(req.body.communityID);
    if (subreddit.state) {
      return res.status(404).json({
        status: 'failed',
        message: 'not found this subreddit',
      })
    }
    // [2] -> check if user isn't moderator in subreddit
    if (!await userServiceInstance.isModeratorInSubreddit(req.body.communityID, req.username)) {
      return res.status(400).json({
        status: 'failed',
        message: 'you aren\'t moderator in this subreddit',
      });
    }
    //check that other user is invited
    if (await userServiceInstance.isInvited(req.body.communityID, req.body.userID)) {
      return res.status(400).json({
        status: 'failed',
        message: 'this user is already moderator',
      });
    }
    await communityServiceInstance.inviteModerator(req.body.communityID, req.body.userID);

  } else {
    return res.status(400).json({
      status: "failed",
      message: "invalid type"
    })
  }
  return res.status(200).json({
    status: "succeeded",
  });
});

const getAllFriends = catchAsync(async (req, res, next) => {
  const friends = await userServiceInstance.getOne({
    _id: req.username,
    select: "-_id friend",
    populate: {
      path: "friend",
      select: "avatar about _id",
    },
  });
  res.status(200).json({
    status: "succeeded",
    friends,
  });
});

const acceptModeratorInvite = catchAsync(async (req, res) => {
  //[1]-> check existence of subreddit
  var subredditReturned = await communityServiceInstance.availableSubreddit(
    req.params.subreddit
  );
  if (subredditReturned.state) {
    return res.status(404).json({
      status: "failed",
      message: "not found this subreddit",
    });
  }
  var subreddit = subredditReturned.subreddit;
  // [2]-> check if the user has been invited to be moderator
  if (!subreddit.invitedModerators.includes(req.username)) {
    return res.status(401).json({
      status: "failed",
      message: "you aren't invited to this subreddit",
    });
  }
  // [3]-> accept the invitation
  //[1] -> update the subreddit invitedModerators
  subreddit = await communityServiceInstance.removeModeratorInvitation(
    subreddit,
    req.username
  );
  var user = await userServiceInstance.getOne({
    _id: req.username,
    select: "moderators",
  });
  //[2] -> update the relation of the user moderators
  await userServiceInstance.addSubredditModeration(req.params.subreddit, user);
  //[3] -> update the subreddit moderators
  await communityServiceInstance.addModerator(subreddit, req.username);
  res.status(200).json({
    status: "success",
  });
});

const updateInfo = catchAsync(async (req, res) => {
  const type = req.body.type;
  const permittedChangedVariables = [
    "gender",
    "about",
    "phoneNumber",
    "name",
    "email",
  ];
  if (!permittedChangedVariables.includes(type)) {
    res.status(400).json({
      status: "failed",
      message: "wrong entered type",
    });
  }
  //[TODO]: we must check if the new name or email is available in case of changing email and name
  var update = {};
  update[type + ""] = req.body.value;
  userServiceInstance.updateOne({ _id: req.username }, update);
  res.status(200).json({
    status: "succeeded",
  });
});

const leaveModeratorOfSubredddit = catchAsync(async (req, res) => {
  //[1]-> check the existence of the moderator
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
  //[3]-> do leaving the subreddit
  await userServiceInstance.updateOne(
    { _id: req.username },
    {
      $pull: {
        moderators: { communityId: req.params.subreddit },
      },
    }
  );
  await communityServiceInstance.updateOne(
    { _id: req.params.subreddit },
    {
      $pull: {
        moderators: { userID: req.username },
      },
    }
  );
  return res.status(200).json({
    status: "succeded",
  });
})

const getUserInfo = catchAsync(async (req, res, next) => {
  const user = await userServiceInstance.getOne({ _id: req.params.username, select: 'avatar _id about' });
  if (!user) {
    return res.status(404).json({
      status: 'failed',
      message: 'not found this user'
    });
  }
  else {
    return res.status(200).json({
      about: user.about,
      id: user._id,
      avatar: user.avatar,
    });
  }
})
module.exports = {
  uploadUserPhoto,
  block,
  spam,
  updateEmail,
  returnResponse,
  getUserMe,
  getUserAbout,
  getUserPrefs,
  editUserPrefs,
  subscribe,
  getUserSavedPosts,
  friendRequest,
  getAllFriends,
  acceptModeratorInvite,
  updateInfo,
  leaveModeratorOfSubredddit,
  followers,
  getInterests,
  addInterests,
  updateInfo,
  getUserInfo,
};
