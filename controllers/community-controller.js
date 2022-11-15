const AppError = require("../utils/app-error");
const catchAsync = require("../utils/catch-async");
const Community = require("./../models/community-model");
const User = require("./../models/user-model");
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
  if (!req.file) return next(new AppError("No photo is uploaded!", 400));
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
  if (!req.file) return next(new AppError("No photo is uploaded!", 400));
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
/**
 * Set suggested comment sort of a subreddit (srName and suggestedCommentSort must be sent in request body)
 * @param {Object} req request must contain srName and suggested comment sort
 * @param {Object} res
 * @returns {object} status
 */
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
    (err) => {
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

/**
 * Get the list of communities that the user moderates them
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const getModerates = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.username).select("moderators");
  if (!user) return next(new AppError("This user doesn't exist!", 404));
  let communityIDs = [];
  user.moderators.forEach((el) => {
    communityIDs.push(el.communityId);
  });
  const communities = await Community.find({
    _id: { $in: communityIDs },
  }).select("icon description category");
  res.status(200).json({
    status: "success",
    communities,
  });
});

/**
 * Get the list of communities that the user subscribes to them
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const getSubscribed = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.username).select("member");
  if (!user) return next(new AppError("This user doesn't exist!", 404));
  let communityIDs = [];
  user.member.forEach((el) => {
    communityIDs.push(el.communityId);
  });
  const communities = await Community.find({
    _id: { $in: communityIDs },
  }).select("icon description category");
  res.status(200).json({
    status: "success",
    communities,
  });
});

/**
 * Ban a user within a community
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const ban = catchAsync(async (req, res, next) => {
  const community = await Community.findById(req.params.subreddit).select(
    "members moderators"
  );
  if (!community)
    return next(new AppError("This subreddit doesn't exist!", 404));
  let bannerFound = false;
  let toBeBannedFound = false;
  community.moderators.forEach((el) => {
    if (el.userID === req.username) bannerFound = true;
    if (el.userID === req.body.userID) toBeBannedFound = true;
  });
  if (!bannerFound || toBeBannedFound)
    return next(
      new AppError(
        "You cannot make this operation this user in this subreddit!",
        400
      )
    );
  community.members.map((el) =>
    el.userID === req.body.userID
      ? req.body.operation === "ban"
        ? (el.isBanned = true)
        : (el.isBanned = false)
      : el
  );
  const toBeBanned = await User.findById(req.body.userID).select("member");
  toBeBanned.member.map((el) =>
    el.communityId === community._id
      ? req.body.operation === "ban"
        ? (el.isBanned = true)
        : (el.isBanned = false)
      : el
  );
  await toBeBanned.save();
  await community.save();
  res.status(200).json({
    status: "success",
    message: "Operation is done successfully",
  });
});

/**
 * Get all banned users within a community
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const getBanned = catchAsync(async (req, res, next) => {
  const community = await Community.findById(req.params.subreddit).select(
    "members"
  );
  if (!community)
    return next(new AppError("This subreddit doesn't exist!", 404));
  let memberIDs = [];
  community.members.forEach((el) => {
    if (el.isBanned) memberIDs.push(el.userID);
  });
  const users = await User.find({
    _id: { $in: memberIDs },
  }).select("avatar about");
  res.status(200).json({
    status: "success",
    users,
  });
});

/**
 * Mute a user within a community
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const mute = catchAsync(async (req, res, next) => {
  const community = await Community.findById(req.params.subreddit).select(
    "members moderators"
  );
  if (!community)
    return next(new AppError("This subreddit doesn't exist!", 404));
  let muterFound = false;
  let toBeMutedFound = false;
  community.moderators.forEach((el) => {
    if (el.userID === req.username) muterFound = true;
    if (el.userID === req.body.userID) toBeMutedFound = true;
  });
  if (!muterFound || toBeMutedFound)
    return next(
      new AppError(
        "You cannot make this operation this user in this subreddit!",
        400
      )
    );
  community.members.map((el) =>
    el.userID === req.body.userID
      ? req.body.operation === "mute"
        ? (el.isMuted = true)
        : (el.isMuted = false)
      : el
  );
  const toBeMuted = await User.findById(req.body.userID).select("member");
  toBeMuted.member.map((el) =>
    el.communityId === community._id
      ? req.body.operation === "mute"
        ? (el.isMuted = true)
        : (el.isMuted = false)
      : el
  );
  await toBeMuted.save();
  await community.save();
  res.status(200).json({
    status: "success",
    message: "Operation is done successfully",
  });
});

/**
 * Get all muted users within a community
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const getMuted = catchAsync(async (req, res, next) => {
  const community = await Community.findById(req.params.subreddit).select(
    "members"
  );
  if (!community)
    return next(new AppError("This subreddit doesn't exist!", 404));
  let memberIDs = [];
  community.members.forEach((el) => {
    if (el.isMuted) memberIDs.push(el.userID);
  });
  const users = await User.find({
    _id: { $in: memberIDs },
  }).select("avatar about");
  res.status(200).json({
    status: "success",
    users,
  });
});

/**
 * Get all moderators of a subreddit
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const getModerators = catchAsync(async (req, res, next) => {
  const community = await Community.findById(req.params.subreddit).select(
    "moderators"
  );
  if (!community)
    return next(new AppError("This subreddit doesn't exist!", 404));
  let moderatorIDs = [];
  community.moderators.forEach((el) => {
    moderatorIDs.push(el.userID);
  });
  const users = await User.find({
    _id: { $in: moderatorIDs },
  }).select("avatar about");
  res.status(200).json({
    status: "success",
    users,
  });
});

/**
 * Get community options of a subreddit
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const getCommunityOptions = catchAsync(async (req, res, next) => {
  const community = await Community.findById(req.params.subreddit).select(
    "communityOptions"
  );
  if (!community)
    return next(new AppError("This subreddit doesn't exist!", 404));
  res.status(200).json(community.communityOptions);
});

module.exports = {
  resizeCommunityIcon,
  resizeCommunityBanner,
  uploadCommunityIcon,
  uploadCommunityBanner,
  setSuggestedSort,
  getModerates,
  getSubscribed,
  ban,
  getBanned,
  mute,
  getMuted,
  getModerators,
  getCommunityOptions,
};
