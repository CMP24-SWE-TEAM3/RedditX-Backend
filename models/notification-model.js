const mongoose = require("mongoose");

const notificationItemSchema = mongoose.Schema({
  notificationID: {
    type: String,
    required: [true, "A notification must have an id!"],
  },
  icon: String,
  isDeleted: {
    type: Boolean,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  title: String,
  type:{
    type: String,
    enum: ["trending", "mention","reply to post", "reply to comment","new followers", "mod notifications", "upvotes to your posts","upvotes to your comments"],
  },//how to say eno akhtar been 7agat mo3yna bs wla msh matlob mne?
  text: String,
  sourceObject: String,
});

const postSchema = mongoose.Schema({
  postID: String,
});

const commentSchema = mongoose.Schema({
  commentID: String,
});

const commuitySchema = mongoose.Schema({
  commuityID: String,
});

const userSchema = mongoose.Schema({
  userID: String,
});

const messageSchema = mongoose.Schema({
  messageID: String,
});

const notificationSchema = mongoose.Schema({
  notification: notificationItemSchema,
  posts: [
    {
      type: postSchema,
    },
  ],
  users: [
    {
      type: userSchema,
    },
  ],
  comments: [
    {
      type: commentSchema,
    },
  ],
  commuinties: [
    {
      type: commuitySchema,
    },
  ],
  messages: [
    {
      type: messageSchema,
    },
  ],
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;