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
  postID: {
    type: mongoose.Schema.ObjectId,
    ref: "Post",
  },
  replies: [
    {
      type: mongoose.Schema.ObjectId,
    },
  ],
  textHTML: {
    type: String,
    trim: true, // Remove all the white space in the beginning or end of the field
  },
  textJSON: {
    type: String,
    trim: true, // Remove all the white space in the beginning or end of the field
  },
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
  communityID: {
    type: String,
    ref: "Community",
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

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "postID",
    select: "title userID votesCount commentsNum createdAt",
  }).populate({
    path: "communityID",
    select: "icon",
  });
  next();
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
