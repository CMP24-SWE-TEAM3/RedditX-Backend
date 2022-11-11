const Comment = require("../models/comment-model");
const Post = require("../models/post-model");
const validators = require("../validate/comment-validators");

/**
 * Vote over a post or a comment (id and dir must be sent in request body)
 * @param {Object} req request must contain dir and id.
 * @param {Object} res
 * @returns {String} status whether failed or not. 
 */
const vote = async (req, res) => {
  if (req.body.id === undefined || req.body.dir === undefined)
    return res.status(500).json({
      status: "invalid post id or dir",
    });
  const id = req.body.id.substring(0, 2);
  const dir = req.body.dir;
  const postIdCasted = req.body.id.substring(3);
  const check = validators.validateVoteIn(id, dir, postIdCasted);
  if (!check) {
    return res.status(500).json({
      status: "invalid post id or dir",
    });
  }
  if (id === "t3") {
    //post
    const post = await Post.findById({ _id: postIdCasted });
    if (!post) {
      return res.status(500).json({
        status: "not found",
      });
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
      { $set: { votesCount: votesCount + operation } },
      { new: true },
      (err, doc) => {
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

    const comment = await Comment.findById({ _id: postIdCasted });
    if (!comment) {
      return res.status(500).json({
        status: "not found",
      });
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
      { $set: { votesCount: votesCount + operation } },
      { new: true },
      (err, doc) => {
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
module.exports = {
  vote,
};
