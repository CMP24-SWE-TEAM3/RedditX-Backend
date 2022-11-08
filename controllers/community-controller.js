const AppError = require("../utils/app-error");
const catchAsync = require("../utils/catch-async");
const Community = require("./../models/community-model");
const User = require("./../models/user-model");
const sharp = require("sharp");

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
  const community = await Community.findById(req.params.subreddit); // Note that front passes for ex: t5_imagePro
  if (!community)
    return next(new AppError("This subreddit doesn't exist!", 404));
  if (
    !community.moderators.find((moderator) => moderator.userID === req.username)
  )
    return next(
      new AppError("You are not a moderator of this subreddit!", 401)
    );
  community.icon = req.file.filename;
  await community.save();
  res.status(200).json({
    status: "success",
    message: "Icon is updated successfully",
  });
});

exports.uploadCommunityBanner = catchAsync(async (req, res, next) => {
  const community = await Community.findById(req.params.subreddit); // Note that front passes for ex: t5_imagePro
  if (!community)
    return next(new AppError("This subreddit doesn't exist!", 404));
  if (
    !community.moderators.find((moderator) => moderator.userID === req.username)
  )
    return next(
      new AppError("You are not a moderator of this subreddit!", 401)
    );
  community.banner = req.file.filename;
  await community.save();
  res.status(200).json({
    status: "success",
    message: "Banner is updated successfully",
  });
});
exports.setSuggestedSort = (req, res) => {
  Community.findOneAndUpdate(
    { communityID: req.body.srName },
    { $set: { suggestedCommentSort: req.body.suggestedCommentSort } },
    { new: true },
    (err, doc) => {
      if (err) {
        console.log("error happened while updating");
      } else {
        console.log("asd");
        return res.status(200);
      }
    }
  );
};
exports.getCommunity = catchAsync(async (req, res, next) => {
  console.log(req.username);
  const community = await Community.findById(req.body.id); // Note that front passes for ex: t5_imagePro
  if (!community)
    return next(new AppError("This subreddit doesn't exist!", 404));
  res.status(200).json({
    status: "success",
    message: community,
  });
});

exports.createCommunity = catchAsync(async (req, res, next) => {
  const community = await Community.create(req.body); // Note that front passes for ex: t5_imagePro
  res.status(200).json({
    status: "success",
    message: community,
  });
});
