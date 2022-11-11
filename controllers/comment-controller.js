const Comment = require("../models/comment-model");
const Post = require("../models/post-model");
const validators = require("../validate/comment-validators");
const AppError = require("../utils/app-error");

const vote = async (req, res) => {
  if (!req.body.postId || !req.body.dir)
    return next(new AppError("invalid post id or vote id", 500));
  const id = req.body.postId.substring(0, 2);
  const dir = req.body.dir;
  const postIdCasted = req.body.postId.substring(3);
  const check = validators.validateVoteIn(id, dir, postIdCasted);
  if (!check) {
    return res.status(500).json({
      status: "invalid post id or vote id",
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
          console.log("error happened while updating");
          return res.status(500).json({
            status: "failed",
          });
        } else {
          console.log("asdhere");
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
