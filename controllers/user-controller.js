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
 * Saves filename to database
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const uploadUserPhoto = catchAsync(async (req, res, next) => {
  try {
    await userServiceInstance.uploadUserPhoto(req.body, req.username, req.file);
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    message: "Avatar is updated successfully",
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
      const post = await postServiceInstance.findById(req.body.linkID.slice(3));
      if (!post) return new AppError("This post doesn't exist!", 404);
      if (post.communityID !== undefined && post.communityID !== "")
        community = await communityServiceInstance.findById(
          post.communityID,
          "communityOptions"
        );
      postServiceInstance.spamPost(
        post,
        req.body.spamType,
        req.body.spamText,
        req.username,
        community
      );
    } else {
      // Spam a comment
      var comment = await commentServiceInstance.findById(
        req.body.linkID.slice(3)
      );
      if (!comment)
        return next(new AppError("This comment doesn't exist!", 404));
      comment = await commentServiceInstance.spamComment(
        comment,
        req.body.spamType,
        req.body.spamText,
        req.username
      );
      const post = await postServiceInstance.findById(
        comment.replyingTo,
        "communityID"
      );
      if (post && post.communityID !== undefined && post.communityID !== "")
        community = await communityServiceInstance.findById(
          post.communityID,
          "communityOptions"
        );
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
 * Get user prefs from database
 * @param {String} (username)
 * @returns {object} user
 */
const userPrefs = async (username) => {
  const user = await User.findById(username);
  if (user) {
    return {
      test: true,
      user: user.prefs,
    };
  } else {
    return {
      test: false,
      user: null,
    };
  }
};
/**
 * Get user prefs
 * @param {function} (req,res)
 * @returns {object} res
 */
const getUserPrefs = async (req, res) => {
  const data = await userPrefs(req.username);
  if (data.test) {
    return res.status(200).json({
      data: data.user,
    });
  } else {
    return res.status(404).json({
      response: "username is not found!",
    });
  }
};
/**
 * Get user me info from database
 * @param {String} (username)
 * @returns {object} user
 */
const userMe = async (username) => {
  const user = await User.findById(username);
  if (user) {
    const obj = {
      numComments: user.prefs.commentsNum,
      threadedMessages: user.prefs.threadedMessages,
      showLinkFlair: user.prefs.showLinkFlair,
      countryCode: user.prefs.countryCode,
      langauge: user.prefs.langauge,
      over18: user.prefs.over18,
      defaultCommentSort: user.prefs.defaultCommentSort,
      showLocationBasedRecommendations:
        user.prefs.showLocationBasedRecommendations,
      searchInclude18: user.prefs.searchInclude18,
      publicVotes: user.prefs.publicVotes,
      enableFollwers: user.prefs.enableFollwers,
      liveOrangeRed: user.prefs.liveOrangereds,
      labelNSFW: user.prefs.labelNSFW,
      newWindow: user.prefs.showPostInNewWindow,
      emailPrivateMessage: user.prefs.emailPrivateMessage,
      emailPostReply: user.prefs.emailPostReply,
      emailMessages: user.prefs.emailMessages,
      emailCommentReply: user.prefs.emailCommentReply,
      emailUpvoteComment: user.prefs.emailUpvoteComment,
      about: user.about,
      avatar: user.avatar,
      userID: user._id,
      emailUserNewFollwer: user.meReturn.emailUserNewFollwer,
      emailUpVotePost: user.meReturn.emailUpVotePost,
      emailUsernameMention: user.meReturn.emailUsernameMention,
    };
    return {
      test: true,
      user: obj,
    };
  } else {
    return {
      test: false,
      user: null,
    };
  }
};
/**
 * Get user me info
 * @param {function} (req,,res)
 * @returns {object} res
 */
const getUserMe = async (req, res) => {
  const data = await userMe(req.username);
  if (data.test) {
    return res.status(200).json({
      data: data.user,
    });
  } else {
    return res.status(404).json({
      response: "username is not found!",
    });
  }
};

/**
 * Get user about from database
 * @param {String} (username)
 * @returns {object} user
 */
const userAbout = async (username) => {
  const user = await User.findById(username);
  if (user) {
    const obj = {
      prefShowTrending: user.aboutReturn.prefShowTrending,
      isBlocked: user.aboutReturn.isBlocked,
      isBanned: user.member.isBanned,
      isMuted: user.member.isMuted,
      canCreateSubreddit: user.canCreateSubreddit,
      isMod: user.aboutReturn.isMuted,
      over18: user.prefs.over18,
      hasVerifiedEmail: user.hasVerifiedEmail,
      createdAt: user.createdAt,
      inboxCount: user.inboxCount,
      totalKarma: user.karma,
      linkKarma: user.postKarma,
      acceptFollowers: user.aboutReturn.acceptFollowers,
      commentKarma: user.commentKarma,
      passwordSet: user.isPasswordSet,
      email: user.email,
      about: user.about,
      avatar: user.avatar,
      userID: user._id,
    };
    return {
      test: true,
      user: obj,
    };
  } else {
    return {
      test: false,
      user: null,
    };
  }
};
/**
 * Get user about
 * @param {function} (req,res)
 * @returns {object} res
 */
const getUserAbout = async (req, res) => {
  const data = await userAbout(req.params.username);
  if (data.test) {
    return res.status(200).json({
      data: data.user,
    });
  } else {
    return res.status(404).json({
      response: "username is not found!",
    });
  }
};

module.exports = {
  uploadUserPhoto,
  block,
  spam,
  getUserMe,
  getUserAbout,
  getUserPrefs,
};
