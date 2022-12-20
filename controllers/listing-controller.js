const catchAsync = require("../utils/catch-async");
const Post = require("../models/post-model");
const Comment = require("../models/comment-model");
const Community = require("../models/community-model");
const User = require("../models/user-model");
const PostService = require("./../services/post-service");
// const CommentService = require("./../services/comment-service");
const UserService = require("./../services/user-service");
const CommunityService = require("./../services/community-service");
const CommentService = require("../services/comment-service");
var postServiceInstance = new PostService(Post);
// var commentServiceInstance = new CommentService(Comment);
var userServiceInstance = new UserService(User);
var communityServiceInstance = new CommunityService(Community);
var commentServiceInstance = new CommentService(Comment);

/**
 * Update user text
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const editUserText = catchAsync(async (req, res, next) => {
  if (!req.body.linkID || !req.body.text)
    return res.status(400).json({
      response: "invaild parameters",
    });
  if (req.body.linkID[1] === "3"){
  var results = undefined;
  try {
     results = await postServiceInstance.updateOne(
    { _id: req.body.linkID},
    { text: req.body.text},
    { editedAt: Date.now()}
  );
  } catch (err) {
    return next(err);
  }
 return res.status(200).json({
    response: results,
  });
}else if (req.body.linkID[1] === "1") {
  try {
      results = await commentServiceInstance.updateOne(
      { _id: req.body.linkID},
      { text: req.body.text},
      { editedAt: Date.now()}
    );
  } catch (err) {
    return next(err);
  }
   return res.status(200).json({
      response: results,
    });
}
});
/**
 * User delete a link
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const deleteLink = catchAsync(async (req, res, next) => {
  if (req.body.linkID[1] === "3"){
  try {
    await postServiceInstance.deletePost(req.body.linkID);
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    message: "Post is deleted successfully",
  });
}else if (req.body.linkID[1] === "1") {
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
      req.body.link,
      req.body.action
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
      req.body.linkID,
    );
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    message: "Link is unlocked"
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
      req.body.linkID,
    );
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    message: "Link is locked"
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
      req.body.linkID,
    );
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    message: "Link is unspoiler"
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
      req.body.link,
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
  console.log(req.username);
  const result = await commentServiceInstance.vote(req.body, req.username);
  console.log(result);
  if (result.state) {
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
* Get comments on posts of the user 
* @param {function} (req, res)
* @returns {object} res
*/
const getUserSelfReply = catchAsync(async (req, res, next) => {
  try {
    var comments = await userServiceInstance.userSelfReply(
      req.username,
      req.query
    );
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    comments
  });
});
/**
* Get user comment replies
* @param {function} (req, res)
* @returns {object} res
*/
const getUserCommentReplies = catchAsync(async (req, res, next) => {
try {
  var comments= await userServiceInstance.userCommentReplies(
    req.username,
    req.query
  );
} catch (err) {
  return next(err);
}
res.status(200).json({
  comments
});
});

module.exports = {
  submit,
  save,
  addComment,
  addReply,
  unsave,
  getPosts,
  getPostInsights,
  vote,
  getUserCommentReplies,
  getUserSelfReply,
  editUserText,
  hide,
  unhide,
  deleteLink,
  markNsfw,
  markUnSpoiler,
  markSpoiler,
  markUnLocked,
  markLocked
};
