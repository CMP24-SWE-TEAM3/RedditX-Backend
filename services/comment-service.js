/**
 * FILE: comment-service
 * description: the services related to comments only
 * created at: 15/11/2022
 * created by: Mohamed Nabil
 * authors: Ahmed Lotfy, Shredan Abdullah, Moaz Mohamed, Mohamed Nabil
 */

const Service = require("./service");
const AppError = require("./../utils/app-error");

/**
 * @namespace CommentService
 */
class CommentService extends Service {
  constructor(model) {
    super(model);
  }
  getSearchResults = async (query) => {
    console.log('here');
    const searchQuery = query.q;
    delete query.q;
    return this.getAll(
      {
        $or: [{ text: { $regex: searchQuery, $options: "i" } }],
      },
      query
    );
  };

  /**
   * Spams a comment
   * @param {object} comment
   * @param {string} spamType
   * @param {string} spamText
   * @param {string} username
   * @returns {object} comment
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
   */
  saveSpammedComment = async (comment, community) => {
    if (
      community &&
      comment.spamCount >= community.communityOptions.spamsNumBeforeRemove
    )
      comment.isDeleted = true;
    await comment.save();
  };
}

module.exports = CommentService;
