const AppError = require("../utils/app-error");
const catchAsync = require("../utils/catch-async");
//const User = require('./../models/userModel');
const factory = require("./handler-factory");

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { isActive: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});
exports.getAllUsers = factory.getAll(User);
