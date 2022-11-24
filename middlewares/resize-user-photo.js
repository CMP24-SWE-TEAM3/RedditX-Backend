const sharp = require("sharp");
const catchAsync = require("../utils/catch-async");

/**
 * Name, resize, and save the uploaded file
 * @param {function} (req, res, next)
 */

const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.username}-${Date.now()}.jpg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpg")
    .toFile(`public/users/files/${req.file.filename}`);
  next();
});

module.exports = resizeUserPhoto;
