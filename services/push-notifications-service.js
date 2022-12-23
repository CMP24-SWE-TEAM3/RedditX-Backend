var admin = require("firebase-admin");
var fcm = require("fcm-notification");
var serviceAccount = require("../config/push-notification-key.json");
const certPath = admin.credential.cert(serviceAccount);
var FCM = new fcm(certPath);

/**
 * Service class to send notifications.
 * @class PushNotificationsService
 */
class PushNotificationsService {
  constructor() {}
  /**
   * Send message using firebase
   * @param {Object} message message content.
   * @returns {Object} {status: boolean,message:string}.
   * @function
   */
  sendNotification = async (message) => {
    FCM.send(message, function (err) {
      if (err) {
        return {
          status: false,
          message: err,
        };
      } else {
        return {
          status: true,
          message: "notification sent",
        };
      }
    });
    return {
      status: true,
      message: "notification sent",
    };
  };
  /**
   * Send new follower notification using firebase
   * @param {String} receiverFcmToken notification receiver firebase token.
   * @param {String} followerUsername follower username.
   * @returns {Boolean} status.
   * @function
   */
  newFollowerNotification = async (receiverFcmToken, followerUsername) => {
    try {
      let message = {
        notification: {
          title: "You have a new follower",
          body: `${followerUsername.slice(3)} has followed you`,
        },
        data: {
          followerID: `${followerUsername}`,
          type: "1",
        },
        token: receiverFcmToken,
      };
      const result = await this.sendNotification(message);
      if (result.status) {
        return {
          status: true,
        };
      } else {
        return {
          status: false,
        };
      }
    } catch (err) {
      console.log(err);
    }
  };
  /**
   * Send upvote to post notification using firebase
   * @param {String} receiverFcmToken notification receiver firebase token.
   * @param {String} upvotedUsername upvoted username.
   * @returns {Boolean} status.
   * @function
   */
  upvotePostNotification = async (
    receiverFcmToken,
    upvotedUsername,
    postID
  ) => {
    try {
      let message = {
        notification: {
          title: "You have a new upvote",
          body: `${upvotedUsername.slice(3)} upvoted on your post`,
        },
        data: {
          postID: `${postID}`,
          type: "2",
        },
        token: receiverFcmToken,
      };
      const result = await this.sendNotification(message);
      if (result.status) {
        return {
          status: true,
        };
      } else {
        return {
          status: false,
        };
      }
    } catch (err) {
      console.log(err);
    }
  };
  /**
   * Send upvote to comment notification using firebase
   * @param {String} receiverFcmToken notification receiver firebase token.
   * @param {String} upvotedUsername upvoted username.
   * @param {String} commentID upvoted comment.
   * @param {String} postID post id of upvoted comment.
   * @returns {Boolean} status.
   * @function
   */
  upvoteCommentNotification = async (
    receiverFcmToken,
    upvotedUsername,
    commentID,
    postID
  ) => {
    try {
      console.log(commentID);
      console.log(postID);
      let message = {
        notification: {
          title: "You have a new upvote",
          body: `${upvotedUsername.slice(3)} upvoted on your comment`,
        },
        data: {
          commentID: `${commentID}`,
          postID: `${postID}`,
          type: "3",
        },
        token: receiverFcmToken,
      };
      const result = await this.sendNotification(message);
      if (result.status) {
        return {
          status: true,
        };
      } else {
        return {
          status: false,
        };
      }
    } catch (err) {
      console.log(err);
    }
  };
   /**
   * Send mention notification using firebase
   * @param {String} receiverFcmToken notification receiver firebase token.
   * @param {String} actionUsername username of the user who mention.
   * @param {String} commentID upvoted comment.
   * @returns {Boolean} status.
   * @function
   */
  mentionNotification = async (receiverFcmToken, actionUsername, commentID) => {
    try {
      let message = {
        notification: {
          title: "You have a new mention",
          body: `${actionUsername.slice(3)} mention you on a comment`,
        },
        data: {
          commentID: `${commentID}`,
        },
        token: receiverFcmToken,
      };
      const result = await this.sendNotification(message);
      if (result.status) {
        return {
          status: true,
        };
      } else {
        return {
          status: false,
        };
      }
    } catch (err) {
      console.log(err);
    }
  };
     /**
   * Send reply to post notification using firebase
   * @param {String} receiverFcmToken notification receiver firebase token.
   * @param {String} actionUsername username of the user who mention.
   * @param {String} commentID created comment id.
   * @param {String} postID post id of created comment.
   * @returns {Boolean} status.
   * @function
   */
  replytoPostNotification = async (
    receiverFcmToken,
    actionUsername,
    commentID,
    postID
  ) => {
    try {
      let message = {
        notification: {
          title: "You have a new reply to your post",
          body: `${actionUsername.slice(3)} has replied to your post`,
        },
        data: {
          commentID: `${commentID}`,
          postID: `${postID}`,
          type: "4",
        },
        token: receiverFcmToken,
      };
      const result = await this.sendNotification(message);
      if (result.status) {
        return {
          status: true,
        };
      } else {
        return {
          status: false,
        };
      }
    } catch (err) {
      console.log(err);
    }
  };
     /**
   * Send reply to comment notification using firebase
   * @param {String} receiverFcmToken notification receiver firebase token.
   * @param {String} actionUsername username of the user who mention.
   * @param {String} commentID  comment of created reply.
   * @param {String} replyID created reply id.
   * @returns {Boolean} status.
   * @function
   */
  replytoCommentNotification = async (
    receiverFcmToken,
    actionUsername,
    commentID,
    replyID
  ) => {
    try {
      let message = {
        notification: {
          title: "You have a new reply to your comment",
          body: `${actionUsername.slice(3)} has replied to your comment`,
        },
        data: {
          commentID: `${commentID}`,
          replyID: `${replyID}`,
          type: "5",
        },
        token: receiverFcmToken,
      };
      const result = await this.sendNotification(message);
      if (result.status) {
        return {
          status: true,
        };
      } else {
        return {
          status: false,
        };
      }
    } catch (err) {
      console.log(err);
    }
  };
}
module.exports = PushNotificationsService;
