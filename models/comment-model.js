const mongoose = require("mongoose");
const spamSchema = mongoose.Schema({
  userID: {
    type: String,
    ref: "User",
  },
  text: String,
  type: String,
});
const voteSchema = mongoose.Schema({
  userID: {
    type: String /*mongoose.Schema.ObjectId,*/,
    ref: "User",
  },
  voteType: Number,
});
const commentSchema = new mongoose.Schema({
  authorId: {
    type: String,
    ref: "User",
    required: [true, "Comment must have an authorId!"],
  },
  isRoot: {
    type: Boolean,
    default: true,
  },
  replyingTo: {
    type: mongoose.Schema.ObjectId,
  },
  replies: [
    {
      type: mongoose.Schema.ObjectId,
    },
  ],
  text: String,
  votesCount: {
    type: Number,
    default: 1,
  },
  voters: [
    {
      type: voteSchema,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
  editedAt: {
    type: Date,
  },
  spamCount: {
    type: Number,
    default: 0,
  },
  isCollapsed: {
    type: Boolean,
    default: false,
  },
  spams: [
    {
      type: spamSchema,
    },
  ],
});





const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
