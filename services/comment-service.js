/**
 * FILE: comment-service
 * description: the services related to comments only
 * created at: 15/11/2022
 * created by: Mohamed Nabil
 * authors: Ahmed Lotfy, Shredan Abdullah, Moaz Mohamed, Mohamed Nabil
 */

const Service = require("./service");
const AppError = require("./../utils/app-error");
const User=require("../models/user-model");
const Post=require("../models/post-model");
const Comment=require("../models/comment-model");
const UserService = require("./../services/user-service");
const PostService = require("./../services/post-service");
const idVaildator=require("../validate/listing-validators").validateObjectId;

var userServiceInstance = new UserService(User);
var postServiceInstance = new PostService(Post);
/**
 * @namespace CommentService
 */
class CommentService extends Service {
  constructor(model) {
    super(model);
  }
  getSearchResults = async (query) => {
    //console.log('here');
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

/**
   * Creates a comment and add it to database
   * @param {object} data
   * @param {object} user
   * @returns {object} newComment
   */
 addComment = async (data,username) => {
  console.log("ay haaaga");
  const user = await userServiceInstance.findById(username);
  console.log(user);
   try{ var post = await postServiceInstance.findById(
      {_id: data.postID}
    );}
    catch{
      throw new AppError("invailed postID!", 400); 
    }
   
    console.log(post);
  if (!user) throw new AppError("This user doesn't exist!", 404);
  const newComment=new Comment({
    text:data.text,
    isRoot:true,
  authorId:username,
  replyingTo:data.postID,
  voters: [{userID:username,voteType:1}]
  });
  const result= await newComment.save();
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
 */
 addReply = async (data,username) => {
  if(!idVaildator(data.commentID)){
    throw new AppError("No commentID is provided!", 400);
  }
  const user = await userServiceInstance.findById(username);
    const comment = await Comment.findById(
      {_id: data.commentID}
    );
  if (!user) throw new AppError("This user doesn't exist!", 404);
  const newReply=new Comment({
    text:data.text,
    isRoot:false,
  authorId:username,
  replyingTo:data.commentID,
  voters: [{userID:username,voteType:1}]
  });
  const result= await newReply.save();
  console.log(username);
  if (!result) throw new AppError("This reply doesn't created!", 400);
  user.hasReply.push(result._id);
  comment.replies.push(result._id);
  await user.save();
  await comment.save();
  return result;
};

//  qq = async (data,username) => {
//   const user = await User.findById(username);
//     const comment = await Comment.findById(
//       {_id: data.commentID}
//     );
//   if (!user) throw new AppError("This user doesn't exist!", 404);
//   if (!comment) throw new AppError("No commentID is provided!", 400);
//   const newReply=new Comment({
//     text:data.text,
//     isRoot:false,
//   authorId:username,
//   replyingTo:data.commentID,
//   voters: [{userID:username,voteType:1}]
//   });
//   const result= await newReply.save();
//   console.log(result);
//   if (!result) throw new AppError("This reply doesn't created!", 400);
//   user.hasReply.push(result._id);
//   comment.replies.push(result._id);
//   await user.save();
//   await comment.save();
//   return result;
// };

// addReply = async (data, user,comment) => {
//   if (!user) throw new AppError("This user doesn't exist!", 404);
//   if (!comment) throw new AppError("No commentID is provided!", 400);
//   data.text = user.text;
//   data.userID = user._id;
//   data.voters = [{ userID: user._id, voteType: 1 }];
//   const newReply = await this.insert(data);
//   user.hasReply.push(newReply._id);
//   comment.replies.push(newReply._id);
//   await user.save();
//   await comment.save();
//   return newReply;
// };

}

module.exports = CommentService;
