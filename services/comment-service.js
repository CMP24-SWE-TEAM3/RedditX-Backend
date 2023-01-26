const Service = require("./service");
const AppError = require("./../utils/app-error");
const UserService = require("./../services/user-service");
const idVaildator = require("../validate/listing-validators").validateObjectId;
const validators = require("../validate/listing-validators");
const Post = require("../models/post-model");
const Comment = require("../models/comment-model");
const User = require("../models/user-model");
const PostService = require("./post-service");
var userServiceInstance = new UserService(User);
var postServiceInstance = new PostService(Post);
/**
 * Service class to handle Comment manipulations.
 * @class CommentService
 */
class CommentService extends Service {
  constructor(model) {
    super(model);
  }
  /**
   * Spams a comment
   * @param {object} query
   * @returns {Promise} comments
   * @function
   */
  getSearchResults = async (query) => {
    const searchQuery = query.q;
    delete query.q;
    return this.getAll(
      {
        $or: [{ textHTML: { $regex: searchQuery, $options: "i" } }],
      },
      query
    ).populate({
      path: "authorId",
      select: "_id avatar",
    });
  };

  /**
   * Spams a comment
   * @param {object} comment
   * @param {string} spamType
   * @param {string} spamText
   * @param {string} username
   * @returns {object} comment
   * @function
   */
  spamComment = async (comment, spamType, spamText, username) => {
    if (comment.spams.find((el) => el.userID === username))
      throw new AppError("You spammed this comment before!");
    comment.spams.push({
      userID: username,
      type: spamType,
      text: spamText,
    });
    comment.spamCount++;
    return comment;
  };

  /**
   * Saves spam in a comment
   * @param {object} comment
   * @param {object} community
   * @function
   */
  saveSpammedComment = async (comment, community) => {
    if (
      community &&
      comment.spamCount >= community.communityOptions.spamsNumBeforeRemove
    )
      comment.isDeleted = true;
    await comment.save();
  };

  /**
   * Creates a comment and add it to database
   * @param {object} data
   * @param {object} user
   * @returns {object} newComment
   * @function
   */
  addComment = async (data, username) => {
    const user = await userServiceInstance.findById(username);
    var post = undefined;
    try {
      post = await postServiceInstance.findById({ _id: data.postID });
    } catch {
      throw new AppError("invalid postID!", 400);
    }
    if (!post) throw new AppError("This post doesn't exist!", 404);
    if (!user) throw new AppError("This user doesn't exist!", 404);
    const newComment = new Comment({
      textHTML: data.textHTML,
      textJSON: data.textJSON,
      isRoot: true,
      authorId: username,
      replyingTo: data.postID,
      postID: data.postID,
      communityID: post.communityID,
      voters: [{ userID: username, voteType: 1 }],
    });
    const result = await newComment.save();
    if (!result) throw new AppError("This comment doesn't created!", 400);
    user.hasComment.push(result._id);
    post.postComments.push(result._id);
    await user.save();
    await post.save();
    return result;
  };

  /**
   * Creates a reply and add it to database
   * @param {object} data
   * @param {object} user
   * @returns {object} newReply
   * @function
   */
  addReply = async (data, username) => {
    if (!idVaildator(data.commentID)) {
      throw new AppError("No commentID is provided!", 400);
    }
    const user = await userServiceInstance.findById(username);
    const comment = await Comment.findById({ _id: data.commentID });
    if (!comment) throw new AppError("This comment doesn't exist!", 404);
    if (!user) throw new AppError("This user doesn't exist!", 404);
    const commentCommunityID = comment.communityID
      ? comment.communityID._id
      : undefined;
    const newReply = new Comment({
      textHTML: data.textHTML,
      textJSON: data.textJSON,
      isRoot: false,
      authorId: username,
      replyingTo: data.commentID,
      postID: comment.postID,
      communityID: commentCommunityID,
      voters: [{ userID: username, voteType: 1 }],
    });
    const result = await newReply.save();
    if (!result) throw new AppError("This reply doesn't created!", 400);
    user.hasReply.push(result._id);
    comment.replies.push(result._id);
    await user.save();
    await comment.save();
    return result;
  };
  /**
   * Vote over a post or comment(reply)
   * @param {object} body
   * @param {String} username
   * @returns {object} state
   * @function
   */
  vote = async (body, username) => {
    if (body.id === undefined || body.dir === undefined)
      return {
        state: false,
        error: "invalid id or dir",
      };

    var id = body.id.substring(0, 2);
    var dir = body.dir;
    var postIdCasted = body.id.substring(3);
    const check = validators.validateVoteIn(id, dir, postIdCasted);
    if (!check) {
      return {
        state: false,
        error: "invalid id or dir",
      };
    }
    if (id === "t3") {
      //post
      const post = await postServiceInstance.getOne({ _id: postIdCasted });
      if (!post) {
        return {
          state: false,
          error: "not found",
        };
      }
      var voters = post.voters;
      var isFound = false;
      var index = 0;
      var voter;
      for (let z = 0; z < voters.length; z++) {
        if (voters[z].userID === username) {
          isFound = true;
          voter = voters[z];
          break;
        }
        index++;
      }
      var removeDetector = false;
      var addDetector = false;
      if (!isFound) {
        addDetector = true;
        if (dir == 1 || dir == -1) {
          voters.push({ userID: username, voteType: dir });
        } else if (dir == 0 || dir == 2) {
          return {
            state: false,
            error: "invalid dir",
          };
        }
      } else {
        if (
          (dir == 0 && voter.voteType == 1) ||
          (dir == 2 && voter.voteType == -1)
        ) {
          voters.splice(index, 1);
          removeDetector = true;
        } else if (
          (dir == 0 && voter.voteType == -1) ||
          (dir == 2 && voter.voteType == 1)
        ) {
          return {
            state: false,
            error: "invalid dir",
          };
        } else if (
          (voter.voteType == 1 && dir == -1) ||
          (voter.voteType == -1 && dir == 1)
        ) {
          removeDetector = true;
          addDetector = true;
          voters[index].voteType = dir;
        } else if (dir == voter.voteType) {
          return {
            state: false,
            error: "already voted",
          };
        }
      }
      let votesCount = post.votesCount;
      let operation;
      if (dir == 1 || dir == 2) {
        operation = 1;
      } else if (dir == 0 || dir == -1) {
        operation = -1;
      }

      try {
        if (removeDetector && !addDetector) {
          await User.findOneAndUpdate(
            { _id: username },
            { $pull: { hasVote: { postID: postIdCasted } } }
          ).clone();
        } else if (!removeDetector && addDetector) {
          await User.findOneAndUpdate(
            { _id: username },
            {
              $addToSet: { hasVote: { postID: postIdCasted, type: operation } },
            }
          ).clone();
        } else if (addDetector && removeDetector) {
          await User.findOneAndUpdate(
            { _id: username },
            { $pull: { hasVote: { postID: postIdCasted } } }
          );
          await User.findOneAndUpdate(
            { _id: username },
            {
              $addToSet: { hasVote: { postID: postIdCasted, type: operation } },
            }
          ).clone();
        }
        await Post.findByIdAndUpdate(
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
              return {
                state: false,
                error: "failed",
              };
            } else {
              return {
                state: true,
                status: "done",
              };
            }
          }
        ).clone();
      } catch (err) {
        return {
          status: false,
          error: err,
        };
      }
      return {
        state: true,
        status: "done",
      };
    } else if (id === "t1") {
      //comment or reply
      const comment = await this.getOne({ _id: postIdCasted });
      if (!comment) {
        return {
          state: false,
          error: "not found",
        };
      }
      voters = comment.voters;
      isFound = false;
      index = 0;
      voter;
      for (let z = 0; z < voters.length; z++) {
        if (voters[z].userID === username) {
          isFound = true;
          voter = voters[z];
          break;
        }
        index++;
      }
      removeDetector = false;
      addDetector = false;
      if (!isFound) {
        addDetector = true;

        if (dir == 1 || dir == -1) {
          voters.push({ userID: username, voteType: dir });
        } else if (dir == 0 || dir == 2) {
          return {
            state: false,
            error: "invalid dir",
          };
        }
      } else {
        if (
          (dir == 0 && voter.voteType == 1) ||
          (dir == 2 && voter.voteType == -1)
        ) {
          voters.splice(index, 1);
          removeDetector = true;
        } else if (
          (dir == 0 && voter.voteType == -1) ||
          (dir == 2 && voter.voteType == 1)
        ) {
          return {
            state: false,
            error: "invalid dir",
          };
        } else if (
          (voter.voteType == 1 && dir == -1) ||
          (voter.voteType == -1 && dir == 1)
        ) {
          removeDetector = true;
          addDetector = true;
          voters[index].voteType = dir;
        } else if (dir == voter.voteType) {
          return {
            state: false,
            error: "already voted",
          };
        }
      }
      let votesCount = comment.votesCount;
      let operation;
      if (dir == 1 || dir == 2) {
        operation = 1;
      } else if (dir == 0 || dir == -1) {
        operation = -1;
      }
      try {
        if (removeDetector && !addDetector) {
          await User.findOneAndUpdate(
            { _id: username },
            { $pull: { votedComments: { commentID: postIdCasted } } }
          ).clone();
        } else if (!removeDetector && addDetector) {
          await User.findOneAndUpdate(
            { _id: username },
            {
              $addToSet: {
                votedComments: { commentID: postIdCasted, type: operation },
              },
            }
          ).clone();
        } else if (addDetector && removeDetector) {
          await User.findOneAndUpdate(
            { _id: username },
            { $pull: { votedComments: { commentID: postIdCasted } } }
          );
          await User.findOneAndUpdate(
            { _id: username },
            {
              $addToSet: {
                votedComments: { commentID: postIdCasted, type: operation },
              },
            }
          ).clone();
        }

        Comment.findByIdAndUpdate(
          { _id: postIdCasted },
          { $set: { votesCount: votesCount + operation, voters: voters } },
          { new: true },
          () => {}
        ).clone();

        return {
          state: true,
          status: "done",
        };
      } catch {
        return {
          state: false,
          error: "failed",
        };
      }
    }
  };

  /**
   * User delete a comment
   * @param {string} linkID
   * @function
   */
  deleteComment = async (linkID) => {
    const comment = await this.getOne({ _id: linkID });
    if (!comment) throw new AppError("linkID doesn't exist!", 404);
    comment.isDeleted = true;
    await comment.save();
  };

  checkUser = async (user, comment) => {
    return (
      (await this.getOne({ _id: comment, select: "authorId" }))["authorId"] ===
      user
    );
  };

  /**
   * show certain comment
   * @param {string} comment
   * @function
   */
  showComment = async (comment) => {
    await this.updateOne({ _id: comment }, { isCollapsed: false });
  };

  /**
   * moderator approve comment in subreddit
   * @param {string} comment
   * @function
   */
  approveComment = async (comment) => {
    comment.isDeleted = false;
    comment.spams = [];
    comment.spamCount = 0;
    await comment.save();
  };

  /**
   * moderator remove comment in subreddit
   * @param {string} comment
   * @function
   */
  removeComment = async (comment) => {
    comment.isDeleted = true;
    await comment.save();
  };

  userComments = async (commentIds, query) => {
    /*if the request didn't contain limit in its query then will add it to the query with 10 at default */
    query.limit = query.limit || "10";
    /*return posts to controller */
    return await this.getAll({ _id: { $in: commentIds } }, query); //addedFilter contain either the subreddit or the information of signed in user
  };
}

module.exports = CommentService;
