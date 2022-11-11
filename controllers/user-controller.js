const AppError = require("../utils/app-error");
const catchAsync = require("../utils/catch-async");
const User = require("./../models/user-model");
const Post = require("./../models/post-model");
const Comment = require("./../models/comment-model");
const Community = require("./../models/community-model");
const sharp = require("sharp");

/**
 * Name, resize, and save the uploaded file
 * @param {function} (req, res, next)
 */

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.username}-${Date.now()}.jpg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpg")
    .toFile(`public/users/files/${req.file.filename}`);
  next();
});

/**
 * Saves filename to database
 * @param {function} (req, res, next)
 * @returns {object} res
 */
exports.uploadUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.body.action)
    return next(new AppError("No attachment or action is provided!", 500));
  let avatar = "default.jpg";
  if (req.body.action === "upload") {
    avatar = req.file.filename;
  }
  await User.findByIdAndUpdate(
    req.username,
    { avatar },
    { runValidators: true }
  );
  res.status(200).json({
    status: "success",
    message: "Avatar is updated successfully",
  });
});

/**
 * Blocks another user
 * @param {function} (req, res, next)
 * @returns {object} res
 */
exports.block = catchAsync(async (req, res, next) => {
  if (!req.body.userID)
    return next(new AppError("No linkID is provided!", 400));
  const toUser = await User.findById(req.body.userID);
  const myUser = await User.findById(req.username);
  if (!toUser || !myUser)
    return next(new AppError("This user doesn't exist!", 404));
  if (req.body.action === true) {
    // block
    if (toUser.blocksToMe.find((el) => el === req.username))
      return res.status(200).json({
        status: "success",
        message: "Blocks are updated successfully",
      });
    myUser.blocksFromMe.push(req.body.userID);
    toUser.blocksToMe.push(req.username);
  } else {
    // unblock
    myUser.blocksFromMe.splice(
      myUser.blocksFromMe.findIndex((el) => el === req.body.userID),
      1
    );
    toUser.blocksToMe.splice(
      toUser.blocksToMe.findIndex((el) => el === req.username),
      1
    );
  }
  await myUser.save();
  await toUser.save();
  res.status(200).json({
    status: "success",
    message: "Blocks are updated successfully",
  });
});

/**
 * Spams a post or a comment
 * @param {function} (req, res, next)
 * @returns {object} res
 */
exports.spam = catchAsync(async (req, res, next) => {
  if (!req.body.linkID)
    return next(new AppError("No linkID is provided!", 400));
  if (req.body.linkID[1] === "3") {
    // Spam a post
    const post = await Post.findById(req.body.linkID.slice(3));
    if (!post) return next(new AppError("This post doesn't exist!", 404));
    if (post.spammers.find((el) => el.spammerID === req.username))
      return res.status(200).json({
        status: "success",
        message: "Spams are updated successfully",
      });
    post.spammers.push({
      spammerID: req.username,
      spamType: req.body.spamType,
      spamText: req.body.spamText,
    });
    post.spamCount++;
    if (post.communityID !== undefined && post.communityID !== "") {
      const community = await Community.findById(post.communityID).select(
        "communityOptions"
      );
      if (post.spamCount >= community.communityOptions.spamsNumBeforeRemove)
        post.isDeleted = true;
    }
    await post.save();
  } else {
    // Spam a comment
    const comment = await Comment.findById(req.body.linkID.slice(3));
    if (!comment) return next(new AppError("This comment doesn't exist!", 404));
    if (comment.spams.find((el) => el.userID === req.username))
      return res.status(200).json({
        status: "success",
        message: "Spams are updated successfully",
      });
    comment.spams.push({
      userID: req.username,
      type: req.body.spamType,
      text: req.body.spamText,
    });
    comment.spamCount++;
    const post = await Post.findById(comment.replyingTo).select("communityID");
    if (post.communityID !== undefined && post.communityID !== "") {
      const community = await Community.findById(post.communityID).select(
        "communityOptions"
      );
      if (comment.spamCount >= community.communityOptions.spamsNumBeforeRemove)
        comment.isDeleted = true;
    }
    await comment.save();
  }
  res.status(200).json({
    status: "success",
    message: "Spams are updated successfully",
  });
});
