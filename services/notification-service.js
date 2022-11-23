/**
 * FILE: notification-service
 * description: the services related to notifications only
 * created at: 15/11/2022
 * created by: Moaz Mohamed
 * authors: Ahmed Lotfy, Shredan Abdullah, Moaz Mohamed, Mohamed Nabil
 */

const Service = require("./service");
const AppError = require("../utils/app-error");

/**
 * @namespace NotificationService
 */
class NotificationService extends Service {
  constructor(model) {
    super(model);
  }

  /**
   * Get notifications for a given user
   * @param {string} linkID
   * @param {object} user
   */
  getNotifications = async (user, query) => {
    if (!user) throw new AppError("This user doesn't exist!", 404);
    /*if the request didn't contain limit in its query then will add it to the query with 10 at default */
    if (!query.limit) {
      query.limit = "10";
    }
    let filter =
      query.type === "history"
        ? { _id: { $in: user.notifications } }
        : { _id: { $in: user.notifications }, isDeleted: false }; // -createdAt(to give old first) is done inside api features
    const notifications = await this.getAll(filter, query);
    return notifications;
  };
}

module.exports = NotificationService;
