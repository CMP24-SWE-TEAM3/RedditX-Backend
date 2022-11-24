const catchAsync = require("../utils/catch-async");
const User = require("../models/user-model");
const Notification = require("../models/notification-model");
const UserService = require("./../services/user-service");
const NotificationService = require("./../services/notification-service");

const notificationServiceInstance = new NotificationService(Notification);
const userServiceInstance = new UserService(User);
/**
 * Get notifications for a given user
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const getNotifications = catchAsync(async (req, res, next) => {
  var notifications = undefined;
  try {
    const user = await userServiceInstance.getOne({
      _id: req.username,
      select: "notifications",
    });
    notifications = await notificationServiceInstance.getNotifications(
      user,
      req.query
    );
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    notifications,
  });
});

module.exports = {
  getNotifications,
};
