const catchAsync = require("../utils/catch-async");
const CommentService = require("./../services/comment-service");
const Comment = require("./../models/comment-model");

const commentServiceInstance = new CommentService(Comment);
/**
 * show comment
 * @param {function} (req, res)
 * @returns {object} res
 */
const showComment = catchAsync(async (req, res) => {
  //[1] -> check the owner of the user
  const comment = req.body.commentID;
  if (!(await commentServiceInstance.checkUser(req.username, comment))) {
    return res.status(400).json({
      status: "failed",
      message: "you aren't the owner of the comment",
    });
  }
  //[2] -> mark the comment to uncollapsed
  commentServiceInstance.showComment(comment);
  return res.status(200).json({
    status: "succeded",
  });
});
module.exports = {
  showComment,
};
