const catchAsync = require("../utils/catch-async");
const User = require("../models/user-model");
const Notification = require("../models/notification-model");
const APIFeatures = require("../utils/api-features");

/**
 * Get notifications for a given user
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const getNotifications = catchAsync(async (req, res) => {
  const user = await User.findById(req.username).select("notifications");
  /*if the request didn't contain limit in its query then will add it to the query with 10 at default */
  if (!req.query.limit) {
    req.query.limit = "10";
  }
  let filter =
    req.query.type === "history"
      ? { _id: { $in: user.notifications } }
      : { _id: { $in: user.notifications }, isDeleted: false }; // -createdAt(to give old first) is done inside api features
  const features = new APIFeatures(Notification.find(filter), req.query)
    .filter()
    .paginate()
    .sort()
    .selectFields();
  const notifications = await features.query;
  res.status(200).json({
    status: "success",
    notifications,
  });
});

module.exports = {
  getNotifications,
};
