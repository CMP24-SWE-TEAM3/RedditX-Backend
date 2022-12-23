const catchAsync = require("../utils/catch-async");
const Post = require("../models/post-model");
const Comment = require("../models/comment-model");
const Community = require("../models/community-model");
const User = require("../models/user-model");
const Notification = require("../models/notification-model");

const PostService = require("./../services/post-service");
// const CommentService = require("./../services/comment-service");
const UserService = require("./../services/user-service");
const CommunityService = require("./../services/community-service");
const CommentService = require("../services/comment-service");
const NotificationService = require("../services/notification-service");
const AppError = require("../utils/app-error");
var postServiceInstance = new PostService(Post);
var notificationServiceInstance = new NotificationService(Notification);
// var commentServiceInstance = new CommentService(Comment);
var userServiceInstance = new UserService(User);
var communityServiceInstance = new CommunityService(Community);
var commentServiceInstance = new CommentService(Comment);
const PushNotificationService = require("../services/push-notifications-service");
var pushNotificationServiceInstance = new PushNotificationService();

const idValidator = require("../validate/listing-validators").validateObjectId;
/**
 * Update user text
 * @param {function} (req, res)
 * @returns {object} res
 */
const editUserText = async (req, res, next) => {
  if (!req.body.linkID)
    return res.status(400).json({
      response: "invaild parameters",
    });
  const linkID = req.body.linkID;
  delete req.body.linkID;
  req.body.editedAt = Date.now();
  if (linkID[1] === "3") {
    const post = await postServiceInstance.getOne({
      _id: linkID.slice(3),
      select: "userID",
    });
    if (!post || !post.userID)
      return next(new AppError("This post is not found!", 404));
    if (post.userID !== req.username)
      return next(new AppError("You are not the author of this post!", 400));
    const results = await postServiceInstance.updateOne(
      { _id: linkID.slice(3) },
      req.body,
      { new: true }
    );
    if (!results)
      return res.status(400).json({
        response: "error",
      });
    return res.status(200).json({
      response: results,
    });
  } else if (linkID[1] === "1") {
    const comment = await commentServiceInstance.getOne({
      _id: linkID.slice(3),
      select: "authorId",
    });
    if (!comment) return next(new AppError("This comment is not found!", 404));
    if (comment.authorId !== req.username)
      return next(new AppError("You are not the author of this comment!", 400));
    const results = await commentServiceInstance.updateOne(
      { _id: linkID.slice(3) },
      req.body,
      { new: true }
    );
    if (!results)
      return res.status(400).json({
        response: "error",
      });
    return res.status(200).json({
      response: results,
    });
  }
};
/**
 * User delete a link
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const deleteLink = catchAsync(async (req, res, next) => {
  if (req.body.linkID[1] === "3") {
    try {
      await postServiceInstance.deletePost(req.body.linkID);
    } catch (err) {
      return next(err);
    }
    res.status(200).json({
      status: "success",
      message: "Post is deleted successfully",
    });
  } else if (req.body.linkID[1] === "1") {
    try {
      await commentServiceInstance.deleteComment(req.body.linkID);
    } catch (err) {
      return next(err);
    }
    res.status(200).json({
      status: "success",
      message: "comment is deleted successfully",
    });
  }
});
/**
 * mark post in a commuity as spoiler
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const markSpoiler = catchAsync(async (req, res, next) => {
  try {
    await communityServiceInstance.markAsSpoiler(
      req.params.subreddit,
      req.username,
      req.body.linkID
    );
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    message: "Link is spoiler",
  });
});
/**
 * mark post in a commuity as unlocked
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const markUnLocked = catchAsync(async (req, res, next) => {
  try {
    await communityServiceInstance.markAsUnLocked(
      req.params.subreddit,
      req.username,
      req.body.linkID
    );
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    message: "Link is unlocked",
  });
});
/**
 * mark post in a commuity as locked
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const markLocked = catchAsync(async (req, res, next) => {
  try {
    await communityServiceInstance.markAsLocked(
      req.params.subreddit,
      req.username,
      req.body.linkID
    );
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    message: "Link is locked",
  });
});
/**
 * mark post in a commuity as unspoiler
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const markUnSpoiler = catchAsync(async (req, res, next) => {
  try {
    await communityServiceInstance.markAsUnSpoiler(
      req.params.subreddit,
      req.username,
      req.body.linkID
    );
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    message: "Link is unspoiler",
  });
});
/**
 * mark post in a commuity as nsfw
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const markNsfw = catchAsync(async (req, res, next) => {
  try {
    await communityServiceInstance.markAsNsfw(
      req.params.subreddit,
      req.username,
      req.body.linkID,
      req.body.action
    );
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    message: "Link is edited successfully",
  });
});
/**
 * Creates a comment
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const addComment = catchAsync(async (req, res, next) => {
  let newComment = {};
  try {
    newComment = await commentServiceInstance.addComment(
      req.body,
      req.username
    );
    //notification part
    const post = await postServiceInstance.getOne({
      _id: req.body.postID,
      select: "userID",
    });
    const user_id = post.userID;
    const user = await userServiceInstance.getOne({ _id: req.username });
    const notificationSaver =
      await notificationServiceInstance.createReplyToPostNotification(
        req.username,
        user
      );
    if (!notificationSaver.status) {
      return res.status(404).json({
        status: "Error happened while saving notification in db",
      });
    }
    const saveToUser = await userServiceInstance.saveNOtificationOfUser(
      notificationSaver.id,
      user_id
    );
    if (!saveToUser.status) {
      return res.status(404).json({
        status: "Error happened while saving notification in user db",
      });
    }
    //push notiication

    const fcm_token_user = await userServiceInstance.getOne({
      _id: user_id,
      select: "_id fcmToken",
    });
    var fcmToken = fcm_token_user.fcmToken;
    if (!fcmToken) {
      return res.status(200).json({
        status: "success without push notifications as user doesn't have one",
      });
    }
    const pushResult =
      await pushNotificationServiceInstance.replytoPostNotification(
        fcmToken,
        req.username,
        newComment._id,
        newComment.postID
      );
    if (!pushResult.status) {
      return res.status(500).json({
        status: "Cannot push notification",
      });
    }
  } catch (err) {
    return next(err);
  }
  res.status(201).json(newComment);
});
/**
 * Creates a reply
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const addReply = catchAsync(async (req, res, next) => {
  let newReply = {};
  try {
    newReply = await commentServiceInstance.addReply(req.body, req.username);
    //notification part
    const comment = await commentServiceInstance.getOne({
      _id: req.body.commentID,
      select: "authorId",
    });
    const user_id = comment.authorId;
    const user = await userServiceInstance.getOne({ _id: req.username });
    const notificationSaver =
      await notificationServiceInstance.createReplyToCommentNotification(
        req.username,
        user
      );
    if (!notificationSaver.status) {
      return res.status(404).json({
        status: "Error happened while saving notification in db",
      });
    }
    const saveToUser = await userServiceInstance.saveNOtificationOfUser(
      notificationSaver.id,
      user_id
    );
    if (!saveToUser.status) {
      return res.status(404).json({
        status: "Error happened while saving notification in user db",
      });
    }
    //push notiication
    const fcm_token_user = await userServiceInstance.getOne({
      _id: user_id,
      select: "_id fcmToken",
    });
    console.log(fcm_token_user);
    var fcmToken = fcm_token_user.fcmToken;
    console.log(fcmToken);
    if (!fcmToken) {
      return res.status(200).json({
        status: "success without push notifications as user doesn't have one",
      });
    }
    const pushResult =
      await pushNotificationServiceInstance.replytoCommentNotification(
        fcmToken,
        req.username,
        newReply._id,
        newReply.replyingTo
      );

    if (!pushResult.status) {
      return res.status(500).json({
        status: "Cannot push notification",
      });
    }
  } catch (err) {
    return next(err);
  }
  res.status(201).json(newReply);
});
/**
 * Creates a post and saves the file names to database
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const submit = catchAsync(async (req, res, next) => {
  let newPost = {};
  try {
    const user = await userServiceInstance.getOne({ _id: req.username });
    const community = await communityServiceInstance.getOne({
      _id: req.body.communityID,
      select: "communityOptions",
    });
    newPost = await postServiceInstance.submit(
      req.body,
      req.files,
      user,
      community
    );
  } catch (err) {
    return next(err);
  }
  res.status(201).json(newPost);
});

/**
 * User saves a post
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const save = catchAsync(async (req, res, next) => {
  try {
    const user = await userServiceInstance.getOne({ _id: req.username });
    await postServiceInstance.save(req.body.linkID, user);
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    message: "Post is saved successfully",
  });
});

/**
 * User unsaves a post
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const unsave = catchAsync(async (req, res, next) => {
  try {
    const user = await userServiceInstance.getOne({ _id: req.username });
    await postServiceInstance.unsave(req.body.linkID, user);
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    message: "Post is unsaved successfully",
  });
});

/**
 * Vote over a post or a comment (id and dir must be sent in request body)
 * @param {Object} req request must contain dir and id.
 * @param {Object} res
 * @returns {String} status whether failed or not.
 */
const vote = async (req, res) => {
  const result = await commentServiceInstance.vote(req.body, req.username);
  if (result.state) {
    if (req.body.dir == 1) {
      var user;
      if (req.body.id.substring(0, 2) === "t1") {
        const comment = await commentServiceInstance.getOne({
          _id: req.body.id.slice(3),
        });
        console.log(comment);
        user = await userServiceInstance.getOne({ _id: req.username });
        const notificationSaver =
          await notificationServiceInstance.createUpvoteToCommentNotification(
            req.username,
            user
          );
        if (!notificationSaver.status) {
          return res.status(404).json({
            status: "Error happened while saving notification in db",
          });
        }
        const saveToUser = await userServiceInstance.saveNOtificationOfUser(
          notificationSaver.id,
          comment.authorId
        );
        if (!saveToUser.status) {
          return res.status(404).json({
            status: "Error happened while saving notification in user db",
          });
        }

        //push notiication
        const fcm_token_user = await userServiceInstance.getOne({
          _id: comment.authorId,
          select: "_id fcmToken",
        });
        console.log(fcm_token_user);
        var fcmToken = fcm_token_user.fcmToken;
        console.log(fcmToken);
        if (!fcmToken) {
          return res.status(200).json({
            status:
              "success without push notifications as user doesn't have one",
          });
        }
        const pushResult =
          await pushNotificationServiceInstance.upvoteCommentNotification(
            fcmToken,
            req.username,
            comment._id,
            comment.replyingTo
          );
        if (!pushResult.status) {
          return res.status(500).json({
            status: "Cannot push notification",
          });
        }
      } else {
        const post = await postServiceInstance.getOne({
          _id: req.body.id.slice(3),
        });
        user = await userServiceInstance.getOne({ _id: req.username });
        const notificationSaver =
          await notificationServiceInstance.createUpvoteToPostNotification(
            req.username,
            user
          );
        if (!notificationSaver.status) {
          return res.status(404).json({
            status: "Error happened while saving notification in db",
          });
        }
        console.log(post);
        const saveToUser = await userServiceInstance.saveNOtificationOfUser(
          notificationSaver.id,
          post.userID
        );
        if (!saveToUser.status) {
          console.log(saveToUser.error);
          return res.status(404).json({
            status: "Error happened while saving notification in user db",
          });
        }
        // push notiication
        const fcm_token_user = await userServiceInstance.getOne({
          _id: post.userID,
          select: "_id fcmToken",
        });
        console.log(fcm_token_user);
        fcmToken = fcm_token_user.fcmToken;
        console.log(fcmToken);
        if (!fcmToken) {
          return res.status(200).json({
            status:
              "success without push notifications as user doesn't have one",
          });
        }
        const pushResult =
          await pushNotificationServiceInstance.upvotePostNotification(
            fcmToken,
            req.username,
            post.userID
          );
        if (!pushResult.status) {
          return res.status(500).json({
            status: "Cannot push notification",
          });
        }
      }
    }

    return res.status(200).json({
      status: result.status,
    });
  } else {
    return res.status(500).json({
      status: result.error,
    });
  }
};

/**
 * get posts from the database based on the subreddits and friends of the signed in user if this is exist and based on criteria also and if it isn't will return based on criteria only
 * @param {Function} (req,res)
 * @param {Object} req the request comes from client and edited by previous middlewares eg. possible-auth-check and addSubreddit and contain the username and the subreddit
 * @param {Object} res the response that will be sent to the client
 * @returns {void}
 */
const getPosts = catchAsync(async (req, res) => {
  if (!req.addedFilter && req.username) {
    /* here the request dosn't contain certain subreddit then we will get the posts from friends and subreddits and persons the user follow*/

    /* if user signed in we will do the following
    1.get the categories of the user
    2. get the friends of the user
    3. get the posts based on these categories and the users*/
    req.addedFilter = await userServiceInstance.addUserFilter(req.username);
  }
  const posts = await postServiceInstance.getListingPosts(
    req.params,
    req.query,
    req.addedFilter
  );
  res.status(200).json({
    status: "succeeded",
    posts,
  });
});
/**
 * User hides a post
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const hide = catchAsync(async (req, res, next) => {
  try {
    const user = await userServiceInstance.getOne({ _id: req.username });
    await postServiceInstance.hide(req.body.linkID, user);
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    message: "Post is hidden successfully",
  });
});

/**
 * User unhides a post
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const unhide = catchAsync(async (req, res, next) => {
  try {
    const user = await userServiceInstance.getOne({ _id: req.username });
    await postServiceInstance.unhide(req.body.linkID, user);
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    message: "Post is unhidden successfully",
  });
});
/**
 * get post insights 
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const getPostInsights = catchAsync(async (req, res) => {
  const postInsightsCnt = await postServiceInstance.getOne({
    _id: req.params.post,
    select: "-_id insightCnt",
  });
  return res.status(200).json({
    status: "succeded",
    postInsightsCnt,
  });
});

/**
 * Follow post
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const followPost = async (req, res) => {
  if (
    !req.body.linkID ||
    req.body.action === null ||
    !idValidator(req.body.linkID)
  ) {
    return res.status(500).json({
      response: "invalid parameters",
    });
  }
  const result = await postServiceInstance.followPost(req.body, req.username);
  if (result.status) {
    return res.status(200).json({
      response: "done",
    });
  } else {
    return res.status(500).json({
      response: "operation failed",
      error: result.error,
    });
  }
};
module.exports = {
  submit,
  save,
  addComment,
  addReply,
  unsave,
  getPosts,
  getPostInsights,
  vote,
  editUserText,
  hide,
  unhide,
  deleteLink,
  markNsfw,
  markUnSpoiler,
  markSpoiler,
  markUnLocked,
  markLocked,
  followPost,
};
