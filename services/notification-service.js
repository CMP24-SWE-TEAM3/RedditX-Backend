const Service = require("./service");
const AppError = require("../utils/app-error");

/**
 * Service class to handle Notification manipulations.
 * @class NotificationService
 */
class NotificationService extends Service {
  constructor(model) {
    super(model);
  }

  /**
   * Get notifications for a given user
   * @param {string} linkID
   * @param {object} user
   * @function
   */
  getNotifications = async (user, query) => {
    if (!user) throw new AppError("This user doesn't exist!", 404);
    var notificationIDs = [];
    var isRead = [];
    if (query.type !== "history")
      // home
      user.notifications.forEach((el, index) => {
        if (el.isDeleted !== true) {
          notificationIDs[index] = el.notificationID;
          isRead[index] = el.isRead;
        }
      });
    // history
    else
      user.notifications.forEach((el, index) => {
        notificationIDs[index] = el.notificationID;
        isRead[index] = el.isRead;
      });
    /*if the request didn't contain limit in its query then will add it to the query with 10 at default */
    if (!query.limit) {
      query.limit = "10";
    }
    query.sort = "-createdAt"; // get new first
    const filter = { _id: { $in: notificationIDs } };
    const notificationsData = await this.getAll(filter, query);
    var notifications = [];
    notificationsData.forEach((el, index) => {
      var newEl = { ...el }._doc;
      newEl.isRead = isRead[index];
      notifications[index] = newEl;
    });
    return notifications;
  };

  /**
   * Deletes or marks as read a notification from his notifications list
   * @param {string} notificationID
   * @param {object} user
   * @param {string} type
   * @function
   */
  deleteOrMarkReadUserNotification = async (notificationID, user, type) => {
    if (!notificationID)
      throw new AppError("No notification id is provided!", 400);
    if (!user) throw new AppError("User is not found!", 404);
    const index = user.notifications.findIndex(
      (el) => el.notificationID.toString() === notificationID
    );
    if (index != -1) user.notifications[index][type] = true;
    await user.save();
  };
}

module.exports = NotificationService;
