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

  constructor(){

  }
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
  newFollowerNotification = async (receiverFcmToken, followerUsername) => {
    try {
      let message = {
        notification: {
          title: "You have a new follower",
          body: `${followerUsername} has followed you`,
        },
        data: {
          orderId: "123456",
          orderDate: "2022-12-15",
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
  upvotePostNotification = async (
    receiverFcmToken,
    upvotedUsername,
    postID
  ) => {
    try {
      let message = {
        notification: {
          title: "You have a new upvote",
          body: `${upvotedUsername} upvoted on your post`,
        },
        data: {
          postID: `${postID}`,
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
  upvoteCommentNotification = async (
    receiverFcmToken,
    upvotedUsername,
    commentID
  ) => {
    try {
      let message = {
        notification: {
          title: "You have a new upvote",
          body: `${upvotedUsername} upvoted on your comment`,
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

  mentionNotification = async (receiverFcmToken, actionUsername, commentID) => {
    try {
      let message = {
        notification: {
          title: "You have a new mention",
          body: `${actionUsername} mention you on a comment`,
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
          body: `${actionUsername} has replied to your post`,
        },
        data: {
          commentID: `${commentID}`,
          postID: `${postID}`,
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
          body: `${actionUsername} has replied to your comment`,
        },
        data: {
          commentID: `${commentID}`,
          replyID: `${replyID}`,
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
