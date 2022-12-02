const catchAsync = require("../utils/catch-async");
const Post = require("../models/post-model");
const Comment = require("../models/comment-model");
const Community = require("../models/community-model");
const User = require("../models/user-model");
const validators = require("./../validate/listing-validators");
const PostService = require("./../services/post-service");
const CommentService = require("./../services/comment-service");
const UserService = require("./../services/user-service");
const CommunityService = require("./../services/community-service");

var postServiceInstance = new PostService(Post);
var commentServiceInstance = new CommentService(Comment);
var userServiceInstance = new UserService(User);
var communityServiceInstance = new CommunityService(Community);


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
    newReply = await commentServiceInstance.addReply(
      req.body,
      req.username
    );
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
  if (req.body.id === undefined || req.body.dir === undefined)
    return res.status(500).json({
      status: "invalid id or dir",
    });
  var id = req.body.id.substring(0, 2);
  var dir = req.body.dir;
  var postIdCasted = req.body.id.substring(3);
  const check = validators.validateVoteIn(id, dir, postIdCasted);
  if (!check) {
    return res.status(500).json({
      status: "invalid id or dir",
    });
  }
  if (id === "t3") {
    //post
    const post = await Post.findById(postIdCasted);
    if (!post) {
      return res.status(500).json({
        status: "not found",
      });
    }
    var voters = post.voters;
    var isFound = false;
    var index = 0;
    var voter;
    for (let z = 0; z < voters.length; z++) {
      if (voters[z].userID === req.username) {
        console.log("jj");
        isFound = true;
        voter = voters[z];
        break;
      }
      index++;
    }
    if (!isFound) {
      if (dir == 1 || dir == -1) {
        voters.push({ userID: req.username, voteType: dir });
      } else if (dir == 0 || dir == 2) {
        return res.status(500).json({
          status: "invalid dir",
        });
      }
    } else {
      if (
        (dir == 0 && voter.voteType == 1) ||
        (dir == 2 && voter.voteType == -1)
      ) {
        voters.splice(index, 1);
      } else if (
        (dir == 0 && voter.voteType == -1) ||
        (dir == 2 && voter.voteType == 1)
      ) {
        return res.status(500).json({
          status: "invalid dir",
        });
      } else if (
        (voter.voteType == 1 && dir == -1) ||
        (voter.voteType == -1 && dir == 1)
      ) {
        voters[index].voteType = dir;
      } else if (dir == voter.voteType) {
        return res.status(200).json({
          status: "already voted",
        });
      }
    }
    let votesCount = post.votesCount;
    let operation;
    if (dir == 1 || dir == 2) {
      operation = 1;
    } else if (dir == 0 || dir == -1) {
      operation = -1;
    }
    Post.findByIdAndUpdate(
      { _id: postIdCasted },
      {
        $set: {
          votesCount: votesCount + operation,
          voters: voters,
        },
      },
      { new: true },
      (err) => {
        if (err) {
          return res.status(500).json({
            status: "failed",
          });
        } else {
          return res.status(200).json({
            status: "done",
          });
        }
      }
    );
  } else if (id === "t1") {
    //comment or reply
    const comment = await Comment.findById(postIdCasted);
    if (!comment) {
      return res.status(500).json({
        status: "not found",
      });
    }
    voters = comment.voters;
    isFound = false;
    index = 0;
    voter;
    for (let z = 0; z < voters.length; z++) {
      console.log("loop");
      if (voters[z].userID === req.username) {
        isFound = true;
        voter = voters[z];
        break;
      }
      index++;
    }
    if (!isFound) {
      if (dir == 1 || dir == -1) {
        voters.push({ userID: req.username, voteType: dir });
      } else if (dir == 0 || dir == 2) {
        return res.status(500).json({
          status: "invalid dir",
        });
      }
    } else {
      if (
        (dir == 0 && voter.voteType == 1) ||
        (dir == 2 && voter.voteType == -1)
      ) {
        voters.splice(index, 1);
      } else if (
        (dir == 0 && voter.voteType == -1) ||
        (dir == 2 && voter.voteType == 1)
      ) {
        return res.status(500).json({
          status: "invalid dir",
        });
      } else if (
        (voter.voteType == 1 && dir == -1) ||
        (voter.voteType == -1 && dir == 1)
      ) {
        voters[index].voteType = dir;
      } else if (dir == voter.voteType) {
        return res.status(200).json({
          status: "already voted",
        });
      }
    }
    let votesCount = comment.votesCount;
    let operation;
    if (dir == 1 || dir == 2) {
      operation = 1;
    } else if (dir == 0 || dir == -1) {
      operation = -1;
    }
    Comment.findByIdAndUpdate(
      { _id: postIdCasted },
      { $set: { votesCount: votesCount + operation, voters: voters } },
      { new: true },
      (err) => {
        if (err) {
          return res.status(500).json({
            status: "failed",
          });
        } else {
          return res.status(200).json({
            status: "done",
          });
        }
      }
    );
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
  addComment,
  addReply,
  unsave,
  getPosts,
  vote,
};
