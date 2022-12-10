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
 * Update user email
 * @param {function} (req, res)
 * @returns {object} res
 */
const updateEmail = async (req, res) => {
  if (!req.username || !req.body.email)
    return res.status(400).json({
      response: "invaild parameters",
    });
  const results = await userServiceInstance.updateOne(
    { _id: req.username },
    { email: req.body.email }
  );
  if (!results)
    return res.status(400).json({
      response: "error",
    });
  return res.status(200).json({
    response: results,
  });
};
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
      postServiceInstance.spamPost(
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
      const post = await postServiceInstance.getOne({
        _id: comment.replyingTo,
        select: "communityID",
      });
      if (post && post.communityID !== undefined && post.communityID !== "")
        community = await communityServiceInstance.getOne({
          _id: post.communityID,
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
 * Get user prefs
 * @param {function} (req,res)
 * @returns {object} res
 */
const getUserPrefs = catchAsync(async (req, res, next) => {
  var prefs = undefined;
  try {
    const user = await userServiceInstance.findById(req.username);
    prefs = await communityServiceInstance.userPrefs(user);
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
    const user = await userServiceInstance.findById(req.username);
    about = await communityServiceInstance.userAbout(user);
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
    const user = await userServiceInstance.findById(req.username);
    meInfo = await communityServiceInstance.userMe(user);
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
  console.log(req.body);
  console.log(req.username);

  const result = await userServiceInstance.subscribe(req.body, req.username);
  console.log("res", result);
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

module.exports = {
  uploadUserPhoto,
  block,
  spam,

  updateEmail,

  returnResponse,

  getUserMe,
  getUserAbout,
  getUserPrefs,
  subscribe,
};
