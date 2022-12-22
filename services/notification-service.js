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
      newEl.isRead = false;
      if (isRead[index]) newEl.isRead = true;
      notifications[index] = newEl;
    });
    return notifications;
  };

  /**
   * Deletes or marks as read notification from his notifications list
   * @param {string} notificationID
   * @param {object} user
   * @param {string} type
   * @function
   */
  deleteNotification = async (notificationID) => {
    const notification = await this.getOne({ _id: notificationID });
    if (!notification) throw new AppError("notification doesn't exist!", 404);
    notification.isDeleted = true;
    await notification.save();
  };
  /**
   *Creates follower notification
   * @param {Object} notification
   * @return {Object} state
   * @function
   */
  createFollowerNotification = async (transmitter, avatar) => {
    const notification = {
      userIcon: avatar,
      title: "You have a new follower",
      type: "newFollower",
      text: "u/" + `${transmitter.slice(3)} has followed you`,
      sourceThing: transmitter,
      createdAt: Date.now(),
    };
    var not;

    try {
      not = await this.insert(notification);
    } catch (err) {
      return {
        status: false,
        error: err,
      };
    }
    if (!not) {
      return {
        status: false,
        error: "error happened while inserting in db",
      };
    }
    return {
      status: true,
      id: not._id,
    };
  };
  /**
   *Creates upvote to comment notification
   * @param {String} senderUsername
   * @param {Object} user
   * @return {Object} state
   * @function
   */
  createUpvoteToCommentNotification = async (senderUsername, user) => {
    var notification;

    notification = {
      userIcon: user.avatar,
      title: "You have a new upvote",
      type: "upvoteToYourComment",
      text: "u/" + `${senderUsername.slice(3)} upvoted on your comment`,
      sourceThing: senderUsername,
      createdAt: Date.now(),
    };
    var not;

    try {
      not = await this.insert(notification);
    } catch (err) {
      return {
        status: false,
        error: err,
      };
    }
    if (!not) {
      return {
        status: false,
        error: "error happened while inserting in db",
      };
    }
    return {
      status: true,
      id: not._id,
    };
  };
  /**
   *Creates reply to post notification
   * @param {String} senderUsername
   * @param {Object} user
   * @return {Object} state
   * @function
   */
  createReplyToPostNotification = async (senderUsername, user) => {
    var notification;

    notification = {
      userIcon: user.avatar,
      title: "You have a new reply to your post",
      type: "upvoteToYourComment",
      text: "u/" + `${senderUsername.slice(3)} commented on your post`,
      sourceThing: senderUsername,
      createdAt: Date.now(),
    };
    var not;

    try {
      not = await this.insert(notification);
    } catch (err) {
      return {
        status: false,
        error: err,
      };
    }
    if (!not) {
      return {
        status: false,
        error: "error happened while inserting in db",
      };
    }
    return {
      status: true,
      id: not._id,
    };
  };

  /**
   *Creates reply to comment notification
   * @param {String} senderUsername
   * @param {Object} user
   * @return {Object} state
   * @function
   */
  createReplyToCommentNotification = async (senderUsername, user) => {
    var notification;

    notification = {
      userIcon: user.avatar,
      title: "You have a new reply to your comment",
      type: "upvoteToYourComment",
      text: "u/" + `${senderUsername.slice(3)} replied on your comment`,
      sourceThing: senderUsername,
      createdAt: Date.now(),
    };
    var not;

    try {
      not = await this.insert(notification);
    } catch (err) {
      return {
        status: false,
        error: err,
      };
    }
    if (!not) {
      return {
        status: false,
        error: "error happened while inserting in db",
      };
    }
    return {
      status: true,
      id: not._id,
    };
  };

  /**
   *Creates upvote to post notification
   * @param {String} senderUsername
   * @param {Object} user
   * @return {Object} state
   * @function
   */
  createUpvoteToPostNotification = async (senderUsername, user) => {
    var notification;

    notification = {
      userIcon: user.avatar,
      title: "You have a new upvote",
      type: "upvoteToYourPost",
      text: "u/" + `${senderUsername.slice(3)} upvoted on your post`,
      sourceThing: senderUsername,
      createdAt: Date.now(),
      isRead: false,
      isDeleted: false,
    };
    var not;

    try {
      not = await this.insert(notification);
    } catch (err) {
      return {
        status: false,
        error: err,
      };
    }
    if (!not) {
      return {
        status: false,
        error: "error happened while inserting in db",
      };
    }
    return {
      status: true,
      id: not._id,
    };
  };

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
