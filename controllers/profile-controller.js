const catchAsync = require("../utils/catch-async");
const User = require("../models/user-model");
const UserService = require("./../services/user-service");


var userServiceInstance = new UserService(User);

 /**
 * Get user comments
 * @param {function} (req, res)
 * @returns {object} res
 */
const getUserComments = catchAsync(async (req, res, next) => {
  try {
    const{page=1,limit=10}=req.query;
    var comments = await userServiceInstance
    .userComments(req.params.username)
    .limit(limit*1)
    .skip((page-1)*limit);

  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    comments
  });
});
/**
 * Get posts which upvoted by the user
 * @param {function} (req,res)
 * @returns {object} res
 */
 const getUserUpVoted = catchAsync(async (req, res, next) => {
  try {
    const{page=1,limit=10}=req.query;
    var posts = await userServiceInstance
    .userUpVoted(req.params.username)
    .limit(limit*1)
    .skip((page-1)*limit);
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    posts
  });
});
/**
 * Get posts which downvoted by the user
 * @param {function} (req,res)
 * @returns {object} res
 */
 const getUserDownVoted = catchAsync(async (req, res, next) => {
  try {
    var posts = await userServiceInstance
    .userDownVoted(req.params.username,req.query);

  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    posts
  });
});
/**
 * Get user posts
 * @param {function} (req, res)
 * @returns {object} res
 */
 const getUserSubmitted = catchAsync(async (req, res, next) => {
  
  try {
    const{page=1,limit=10}=req.query;
    var posts = await userServiceInstance
    .userSubmitted(req.params.username)
    .limit(limit*1)
    .skip((page-1)*limit);
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    posts
  });
});
  /**
   * Get posts where user is being mentioned in
   * @param {function} (req,res)
   * @returns {object} res
   */
     const getUserMentions = catchAsync(async (req, res, next) => {
      try {
        const{page=1,limit=10}=req.query;
        var posts  = await userServiceInstance
        .userMentions(req.username)
        .limit(limit*1)
        .skip((page-1)*limit);
      } catch (err) {
        return next(err);
      }
      res.status(200).json({
        posts
      });
    });
  /**
 * Merge three sorted array in one sorted one
 * @param {Array} (A,B)
 * @returns {Array} D
 */
function mergeTwo(A, B) {
  let m = A.length;
  let n = B.length;
  let D = [];

  let i = 0,
    j = 0;
  while (i < m && j < n) {
    if (A[i].createdAt <= B[j].createdAt) D.push(A[i++]);
    else D.push(B[j++]);
  }
  while (i < m) D.push(A[i++]);
  while (j < n) D.push(B[j++]);

  return D;
}  
 /**
//  * Get user overview
//  * @param {function} (req, res)
//  * @returns {object} res
//  */
const getUserOverview = catchAsync(async (req, res, next) => {
  let overviewReturn = [];
    try {
      var posts = await userServiceInstance.userSubmitted(
        req.params.username,
        req.query
      );
      var comments= await userServiceInstance.userComments(
        req.params.username,
        req.query
      );
      var replies = await userServiceInstance.userComments(
        req.params.username,
        req.query
      );
      let merged = mergeTwo(posts, comments);
      overviewReturn = mergeTwo(merged, replies);
    } catch (err) {
      return next(err);
    }
    res.status(200).json({
      overview: overviewReturn.reverse()
    });
  });
  
    module.exports = {
        getUserDownVoted,
        getUserOverview,
        getUserUpVoted,
        getUserMentions,
        getUserSubmitted,
        getUserComments
    };