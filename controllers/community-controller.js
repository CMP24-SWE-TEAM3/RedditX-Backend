const AppError = require("../utils/app-error");
const catchAsync = require("../utils/catch-async");
const Community = require("./../models/community-model");
//const Moderator = require('./../models/moderatorModel');
const factory = require("./handler-factory");
const makeRandomString = require("./../utils/randomString");
const sharp = require("sharp");

let communities = [
  {
    communityID: "id1",
    icon: "default.jpg",
    banner: "default.jpg",
  },
  {
    communityID: "id2",
    icon: "default.jpg",
    banner: "default.jpg",
  },
];

let moderators = [
  {
    moderatorID: "id1",
    communityID: "id1",
    userID: "id1",
  },
  {
    moderatorID: "id2",
    communityID: "id2",
    userID: "id2",
  },
];

exports.resizeCommunityIcon = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `community-icon-${
    req.params.subreddit
  }-${Date.now()}.jpg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpg")
    .toFile(`public/subreddits/files/${req.file.filename}`);
  next();
});

exports.resizeCommunityBanner = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `community-banner-${
    req.params.subreddit
  }-${Date.now()}.jpg`;
  await sharp(req.file.buffer)
    .resize(2000, 500)
    .toFormat("jpg")
    .toFile(`public/subreddits/files/${req.file.filename}`);
  next();
});

exports.uploadCommunityIcon = catchAsync(async (req, res, next) => {
  if (
    !moderators.find(
      (moderator) =>
        moderator.communityID === req.params.subreddit &&
        moderator.userID === req.body.userID
    )
  )
    return next(
      new AppError("You are not a moderator of this subreddit!", 401)
    );
  /*const moderator = await Moderator.find({
    $and: [
      { communityID: req.params.subreddit },
      { userID: req.user.userID },
    ],
  });
  if (!moderator)
    return next(
      new AppError("You are not a moderator of this subreddit!", 401)
    );*/ ///////////// CHANGE TO THIS AFTER MODERATOR MODEL ////////////////
  communities.find(
    (community) => community.communityID === req.params.subreddit
  ).icon = req.file.filename;
  /*await Community.findByIdAndUpdate(
    req.params.subreddit,
    { icon: req.file.filename },
    {
      runValidators: true,
    }
  );*/ ///////// CHANGE TO THIS AFTER USER MODEL //////////
  console.log(communities);
  res.status(200).json({
    status: "success",
    message: "Icon is updated successfully",
  });
});

exports.uploadCommunityBanner = catchAsync(async (req, res, next) => {
  if (
    !moderators.find(
      (moderator) =>
        moderator.communityID === req.params.subreddit &&
        moderator.userID === req.body.userID
    )
  )
    return next(
      new AppError("You are not a moderator of this subreddit!", 401)
    );
  /*const moderator = await Moderator.find({
    $and: [
      { communityID: req.params.subreddit },
      { userID: req.user.userID },
    ],
  });
  if (!moderator)
    return next(
      new AppError("You are not a moderator of this subreddit!", 401)
    );*/ ///////////// CHANGE TO THIS AFTER MODERATOR MODEL ////////////////
  communities.find(
    (community) => community.communityID === req.params.subreddit
  ).banner = req.file.filename;
  /*await Community.findByIdAndUpdate(
      req.params.subreddit,
      { banner: req.file.filename },
      {
        runValidators: true,
      }
    );*/ ///////// CHANGE TO THIS AFTER USER MODEL //////////
  console.log(communities);
  res.status(200).json({
    status: "success",
    message: "Banner is updated successfully",
  });
});
