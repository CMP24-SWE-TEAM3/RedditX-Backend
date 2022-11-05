const AppError = require("../utils/app-error");
const catchAsync = require("../utils/catch-async");
const Post = require("./../models/post-model");
const makeRandomString = require("./../utils/randomString");
const multer = require("multer");

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

exports.uploadPostFiles = upload.array("attachments", 10);

exports.submit = catchAsync(async (req, res, next) => {
  req.body.attachments = [];
  if (req.files) {
    req.files.forEach((file) => req.body.attachments.push(file.filename));
  }
  req.body.createdAt = req.requestTime;
  req.body.communityID = req.body.communityID.slice(3);
  // req.body.userID = req.user.userID;   ////////////// CHANGE TO THIS AFTER PROTECT IS FINISHED ////////////
  req.body.voters = [{ userID: req.body.userID, voteType: 1 }]; /////////// CHANGE TO req.user.userID AFTER PROTECT IS FINISHED ////////////
  const newPost = await Post.create(req.body);
  res.status(201).json(newPost);
});

exports.save = catchAsync(async (req, res, next) => {
  // req.user.saves.push({ postID: req.body.linkID.slice(3), category: req.body.category });
  // await User.updateOne({ userID: req.user.userID }, req.user);
  res.status(200).json({
    status: "success",
    message: "Post is saved successfully",
  });
});

exports.unsave = catchAsync(async (req, res, next) => {
  // req.user.saves.splice(req.user.saves.findIndex(el => el.postID === req.body.linkID.slice(3)), 1);
  // await User.updateOne({ userID: req.user.userID }, req.user);
  res.status(200).json({
    status: "success",
    message: "Post is unsaved successfully",
  });
});
