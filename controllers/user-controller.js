const AppError = require("../utils/app-error");
const catchAsync = require("../utils/catch-async");
//const User = require('./../models/userModel');
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
  /*await User.findByIdAndUpdate(
    req.user.userID,
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
