const AppError = require("../utils/app-error");
const catchAsync = require("../utils/catch-async");
const Community = require("./../models/community-model");
const sharp = require("sharp");

/**
 * Name, resize, and save the uploaded file
 * @param {function} (req, res, next)
 */
const resizeCommunityIcon = catchAsync(async (req, res, next) => {
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

/**
 * Name, resize, and save the uploaded file
 * @param {function} (req, res, next)
 */
const resizeCommunityBanner = catchAsync(async (req, res, next) => {
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

/**
 * Saves filename to database
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const uploadCommunityIcon = catchAsync(async (req, res, next) => {
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

/**
 * Saves filename to database
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const uploadCommunityBanner = catchAsync(async (req, res, next) => {
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
const setSuggestedSort = async (req, res) => {
  if (req.body.srName.substring(0, 2) !== "t5") {
    return res.status(500).json({
      status: "failed",
    });
  }
  Community.findByIdAndUpdate(
    { _id: req.body.srName },
    { $set: { suggestedCommentSort: req.body.suggestedCommentSort } },
    { new: true },
    (err, doc) => {
      if (err) {
        return res.status(500).json({
          status: "failed",
        });
      } else {
        return res.status(200).json({
          status: "done",
        });
      }
    }
  );
};

module.exports = {
  resizeCommunityIcon,
  resizeCommunityBanner,
  uploadCommunityIcon,
  uploadCommunityBanner,
  setSuggestedSort,
};
