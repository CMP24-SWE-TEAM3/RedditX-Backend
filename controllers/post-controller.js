const AppError = require("../utils/app-error");
const catchAsync = require("../utils/catch-async");
const Post = require("./../models/post-model");
const User = require("./../models/user-model");
const makeRandomString = require("./../utils/randomString");
const multer = require("multer");
const APIFeatures = require("../utils/api-features");

/**
 * Name and save the uploaded files
 */
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/posts/files");
  },
  filename: async (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      return cb(null, `post-file-${makeRandomString()}-${Date.now()}.jpg`);
    }
    cb(
      null,
      `post-file-${makeRandomString()}-${Date.now()}-${file.originalname}`
    );
  },
});

const upload = multer({
  storage: multerStorage,
});

/**
 * Upload the files
 */
exports.uploadPostFiles = upload.array("attachments", 10);

/**
 * Creates a post and saves the file names to database
 * @param {function} (req, res, next)
 * @returns {object} res
 */
exports.submit = catchAsync(async (req, res, next) => {
  req.body.attachments = [];
  if (req.files) {
    req.files.forEach((file) => req.body.attachments.push(file.filename));
  }
  req.body.userID = req.username;
  req.body.voters = [{ userID: req.username, voteType: 1 }];
  const user = await User.findById(req.username);
  const newPost = await Post.create(req.body);
  user.hasPost.push(newPost._id);
  await user.save();
  res.status(201).json(newPost);
});

/**
 * User saves a post
 * @param {function} (req, res, next)
 * @returns {object} res
 */
exports.save = catchAsync(async (req, res, next) => {
  if (!req.body.linkID)
    return next(new AppError("No linkID is provided!", 400));
  const user = await User.findById(req.username);
  if (user.savedPosts.find((el) => el.toString() === req.body.linkID.slice(3)))
    return res.status(200).json({
      status: "success",
      message: "Post is saved successfully",
    });
  user.savedPosts.push(req.body.linkID.slice(3));
  await user.save();
  res.status(200).json({
    status: "success",
    message: "Post is saved successfully",
  });
});

/**
 * User unsaves a post
 * @param {function} (req, res, next)
 * @returns {object} res
 */
exports.unsave = catchAsync(async (req, res, next) => {
  if (!req.body.linkID)
    return next(new AppError("No linkID is provided!", 400));
  const user = await User.findById(req.username);
  user.savedPosts.splice(
    user.savedPosts.findIndex((el) => el === req.body.linkID.slice(3)),
    1
  );
  await user.save();
  res.status(200).json({
    status: "success",
    message: "Post is unsaved successfully",
  });
});
