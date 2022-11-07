const AppError = require("../utils/app-error");
const catchAsync = require("../utils/catch-async");
const User = require('./../models/user-model');
const Post = require("./../models/post-model");
//const Comment = require('./../models/comment-model');
const factory = require("./handler-factory");
const makeRandomString = require("./../utils/randomString");
const sharp = require("sharp");

let users = [
  {
    userID: "id1",
    avatar: "default.jpg",
  },
  {
    userID: "id2",
    avatar: "default.jpg",
  },
];

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${makeRandomString()}-${Date.now()}.jpg`;
  // req.file.filename = `user-${req.user.userID}-${Date.now()}.jpg`;  ///////// CHANGE TO THIS AFTER PROTECT FUNCTION ////////////
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpg")
    .toFile(`public/users/files/${req.file.filename}`);
  next();
});

exports.uploadUserPhoto = catchAsync(async (req, res, next) => {
  let avatar = "default.jpg";
  if (req.body.action === "upload") {
    avatar = req.file.filename;
  }
  users.find((user) => user.userID === req.body.userID).avatar = avatar;
  /*await User.updateOne(
    { userID: req.user.userID },
    { avatar },
    {
      runValidators: true,
    }
  );*/ ///////// CHANGE TO THIS AFTER USER MODEL //////////
  res.status(200).json({
    status: "success",
    message: "Avatar is updated successfully",
  });
});

exports.block = catchAsync(async (req, res, next) => {
  if (req.body.action) {
    // req.user.blocks.push(req.body.userID.slice(3));
    // await User.updateOne({ userID: req.user.userID }, req.user);
  } else {
    // req.user.blocks.splice(req.user.blocks.findIndex(el => el === req.body.userID.slice(3)), 1);
    // await User.updateOne({ userID: req.user.userID }, req.user);
  }
  res.status(200).json({
    status: "success",
    message: "Blocks are updated successfully",
  });
});

exports.spam = catchAsync(async (req, res, next) => {
  if (req.body.linkID[1] === "3") {
    // Spam a post
    const post = await Post.findById(req.body.linkID.slice(3));
    if (!post) return next(new AppError("This post doesn't exist!", 404));
    post.spammers.push({
      spammerID: req.body.userID,
      spamType: req.body.spamType,
      spamText: req.body.spamText,
    }); // ////////// CHANGE TO req.user.userID /////////
    await post.save();
  } else {
    // Spam a comment
    /*const comment = await Comment.findById(req.body.linkID.slice(3));
    if (!comment)
      return next(new AppError("This comment doesn't exist!", 404));
    comment.spammers.push({ spammerID: req.user.userID, spamType: req.body.spamType, spamText: req.body.spamText });
    await comment.save(); */
  }
  res.status(200).json({
    status: "success",
    message: "Spams are updated successfully",
  });
});
