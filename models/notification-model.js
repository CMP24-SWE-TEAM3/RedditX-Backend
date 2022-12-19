const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
  userIcon: String,
  communityIcon: String,
  title: String,
  type: {
    type: String,
    enum: [
      "trending",
      "mention",
      "replyToPost",
      "replyToComment",
      "newFollower",
      "modNotifications",
      "upvoteToYourPost",
      "upvoteToYourComment",
      "ban",
      "mute",
      "unban",
      "unmute",
      "newFriendRequest",
      "newFriend",
    ],
  },
  text: String,
  sourceThing: String, // t3_54148d012f459b337e2382ce or t2_moazMohamed (post id, user id, community id, comment, or message id)
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
