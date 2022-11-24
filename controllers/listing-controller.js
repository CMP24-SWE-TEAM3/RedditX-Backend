const catchAsync = require("../utils/catch-async");
const Post = require("../models/post-model");
const Comment = require("../models/comment-model");
const Community = require("../models/community-model");
const User = require("../models/user-model");
const PostService = require("./../services/post-service");
const UserService = require("./../services/user-service");
const CommunityService = require("./../services/community-service");
const CommentService = require("../services/comment-service");
var postServiceInstance = new PostService(Post);
var userServiceInstance = new UserService(User);
var communityServiceInstance = new CommunityService(Community);
var commentServiceInstance = new CommentService(Comment);

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
  const result = await commentServiceInstance.vote(req.body,req.username);
  console.log(result);
  if(result.state){
    return res.status(200).json({
      status:result.status
    })
  }
  else{
    return res.status(500).json({
      status:result.error

    })
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

module.exports = {
  submit,
  save,
  unsave,
  getPosts,
  vote,
};
