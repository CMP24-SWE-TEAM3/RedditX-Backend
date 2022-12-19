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
/**
   * User delete a notification
   * @param {string} notificationID
   * @function
   */
deleteNotification = async (notificationID) => {
  const notification = await this.getOne({_id: notificationID });
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
createFollowerNotification = async (transmitter,avatar) => {
  
  const notification={
    "userIcon":avatar,
    "title":"You have a new follower",
    "type":"newFollower",
    "text":"u/" + `${transmitter.slice(3)} has followed you`,
    "sourceThing":transmitter,
  }
  var not;

  try{
   not=await this.insert(notification);
  }
  catch(err){
    return {
      status:false,
      error:err
    };
  }
  console.log(not);
  if(!not){
    return {
      status:false,
      error:"error happened while inserting in db"
    };
  }
  return {
    status:true,
    id:not._id
  };


};
/**
   *Creates upvote to comment notification
   * @param {String} senderUsername
   * @param {Object} user
   * @return {Object} state
   * @function
   */
   createUpvoteToCommentNotification = async (senderUsername,user) => {
    var notification;
  
     notification={
      "userIcon":user.avatar,
      "title":"You have a new upvote",
      "type":"upvoteToYourComment",
      "text":"u/" + `${senderUsername} upvoted on your comment`,
      "sourceThing":senderUsername,
    }
    var not;
  
    try{
     not=await this.insert(notification);
    }
    catch(err){
      return {
        status:false,
        error:err
      };
    }
    console.log(not);
    if(!not){
      return {
        status:false,
        error:"error happened while inserting in db"
      };
    }
    return {
      status:true,
      id:not._id
    };
  
  
  };
  /**
   *Creates upvote to post notification
   * @param {String} senderUsername
   * @param {Object} user
   * @return {Object} state
   * @function
   */
   createUpvoteToPostNotification = async (senderUsername,user) => {
    var notification;
  
     notification={
      "userIcon":user.avatar,
      "title":"You have a new upvote",
      "type":"upvoteToYourPost",
      "text":"u/" + `${senderUsername} upvoted on your post`,
      "sourceThing":senderUsername,
    }
    var not;
  
    try{
     not=await this.insert(notification);
    }
    catch(err){
      return {
        status:false,
        error:err
      };
    }
    console.log(not);
    if(!not){
      return {
        status:false,
        error:"error happened while inserting in db"
      };
    }
    return {
      status:true,
      id:not._id
    };
  
  
  };

}



module.exports = NotificationService;
