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
