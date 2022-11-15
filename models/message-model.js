const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  messageID: {
    type: String,
    required: [true, "A message must have an id!"],
  },
  fromID: String,
  toID: String,
  isDeleted: {
    type: Boolean,
    default: 0,
  },
  unread_status: {
    type: Boolean,
    default: 0,
  },
  subject: {
    type: String,
    required: [true, "A message must have a subject!"],
    trim: true, // Remove all the white space in the beginning or end of the field
    maxLength: [
      100000,
      "A subject text must have less than or equal to 100000 characters",
    ],
    minLength: [
      1,
      "A subject text must have more than or equal to 1 character",
    ],
  },
  text: {
    type: String,
    required: [true, "A messsage must have a text!"],
    trim: true, // Remove all the white space in the beginning or end of the field
    maxLength: [
      100000,
      "A message text must have less than or equal to 100000 characters",
    ],
    minLength: [
      1,
      "A message text must have more than or equal to 1 character",
    ],
  },
});

const userSchema = mongoose.Schema({
  userID: String,
  fromID: String, //leh ha7tag eluserid w ana m3aia from id??
  toID: String,
});

const notificationSchema = mongoose.Schema({
  notificationID: String,
});

const spamLinkItemSchema = mongoose.Schema({
  linkID: String,
  userId: String,
  text: String,
  type: String,
});

const commuitySchema = mongoose.Schema({
  commuityID: String, ////hwa ana leh ha7tag from id w ana m3aia elcommuity id??
  fromID: String,
  toID: String,
});

const messageItemSchema = mongoose.Schema({
  messageID: {
    type: String,
    required: [true, "A message must have an id!"],
  },
  message: messageSchema,
  isRead: {
    type: Boolean,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  spamCount: Number,
  notification: [
    {
      type: notificationSchema,
    },
  ],
  users: [
    {
      type: userSchema,
    },
  ],
  spams: [
    {
      type: spamLinkItemSchema,
    },
  ],
  commuinties: [
    {
      type: commuitySchema,
    },
  ],
  messages: [
    {
      type: messageItemSchema,
    },
  ],
});

const Message = mongoose.model("Message", messageItemSchema);

module.exports = Message;
