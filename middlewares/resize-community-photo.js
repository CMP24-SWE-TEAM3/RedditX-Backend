const sharp = require("sharp");
const catchAsync = require("../utils/catch-async");

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

module.exports = {
  resizeCommunityIcon,
  resizeCommunityBanner,
};
