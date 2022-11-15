const User = require("./../models/user-model");
const Comment = require("./../models/comment-model");
const Post = require("./../models/post-model");

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
 * Get overview which is written by the user from database
 * @param {String} (username)
 * @returns {object} userOverview
 */
const userOverview = async (username) => {
  const overview = await User.findById(username);
  if (overview) {
    const posts = await Post.find({ _id: { $in: overview.hasPost } });
    const comments = await Comment.find({ _id: { $in: overview.hasComment } });
    const replies = await Comment.find({ _id: { $in: overview.hasReply } });

    let merged = mergeTwo(posts, comments);
    let overviewReturn = [];
    overviewReturn = mergeTwo(merged, replies);
    return {
      test: true,
      userOverview: overviewReturn.reverse(),
    };
  } else {
    return {
      test: false,
      userOverview: null,
    };
  }
};

/**
 * Get user overview
 * @param {function} (req, res)
 * @returns {object} res
 */
const getUserOverview = async (req, res) => {
  const data = await userOverview(req.params.username);
  if (data.test) {
    return res.status(200).json({
      data: data.userOverview,
    });
  } else {
    return res.status(404).json({
      response: "username is not found!",
    });
  }
};
/**
 * Get posts which is written by the user from database
 * @param {String} (username)
 * @returns {object} userSubmitted
 */
const userSubmitted = async (username) => {
  const user = await User.findById(username);
  if (user) {
    const posts = await Post.find({ _id: { $in: user.hasPost } });
    return {
      test: true,
      userSubmitted: posts,
    };
  } else {
    return {
      test: false,
      userSubmitted: null,
    };
  }
};
/**
 * Get user posts
 * @param {function} (req, res)
 * @returns {object} res
 */
const getUserSubmitted = async (req, res) => {
  const data = await userSubmitted(req.params.username);
  if (data.test) {
    return res.status(200).json({
      data: data.userSubmitted,
    });
  } else {
    return res.status(404).json({
      response: "username is not found!",
    });
  }
};
/**
 * Get comments which is written by the user from database
 * @param {String} (username)
 * @returns {object} userComments
 */
const userComments = async (username) => {
  const user = await User.findById(username);
  if (user) {
    const comments = await Comment.find({ _id: { $in: user.hasComment } });
    return {
      test: true,
      userComments: comments,
    };
  } else {
    return {
      test: false,
      userComments: null,
    };
  }
};

/**
 * Get user comments
 * @param {function} (req, res)
 * @returns {object} res
 */
const getUserComments = async (req, res) => {
  const data = await userComments(req.params.username);
  if (data.test) {
    return res.status(200).json({
      data: data.userComments,
    });
  } else {
    return res.status(404).json({
      response: "username is not found!",
    });
  }
};
/**
 * Get posts which downvoted by the user from database
 * @param {String} (username)
 * @returns {object} uservotes
 */
const userDownVoted = async (username) => {
  const dVote = await User.findById(username).select("hasVote");
  if (dVote) {
    const votes = dVote.hasVote;
    let postIDs = [];
    votes.forEach((el) => {
      if (el.type === -1) {
        postIDs.push(el.postID);
      }
    });

    const posts = await Post.find({ _id: { $in: postIDs } });
    return {
      test: true,
      uservotes: posts,
    };
  } else {
    return {
      test: false,
      uservotes: null,
    };
  }
};
/**
 * Get posts which downvoted by the user
 * @param {function} (req,res)
 * @returns {object} res
 */
const getUserDownVoted = async (req, res) => {
  const data = await userDownVoted(req.params.username);
  if (data.test) {
    return res.status(200).json({
      data: data.uservotes,
    });
  } else {
    return res.status(404).json({
      response: "username is not found!",
    });
  }
};
/**
 * Get posts which upvoted by the user from database
 * @param {String} (username)
 * @returns {object} userUpvoted
 */
const userUpVoted = async (username) => {
  const uVote = await User.findById(username).select("hasVote");
  if (uVote) {
    const votes = uVote.hasVote;
    let postIDs = [];
    votes.forEach((el) => {
      if (el.type === 1) {
        postIDs.push(el.postID);
      }
    });

    const posts = await Post.find({ _id: { $in: postIDs } });
    return {
      test: true,
      userUpvoted: posts,
    };
  } else {
    return {
      test: false,
      userUpvoted: null,
    };
  }
};
/**
 * Get posts which upvoted by the user
 * @param {function} (req, res)
 * @returns {object} res
 */
const getUserUpVoted = async (req, res) => {
  const data = await userUpVoted(req.params.username);
  if (data.test) {
    return res.status(200).json({
      data: data.userUpvoted,
    });
  } else {
    return res.status(404).json({
      response: "username is not found!",
    });
  }
};
module.exports = {
  getUserDownVoted,
  getUserOverview,
  getUserUpVoted,
  getUserSubmitted,
  getUserComments,
};
