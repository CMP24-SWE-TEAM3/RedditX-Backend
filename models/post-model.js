const mongoose = require("mongoose");

// postID here is the _id from mongoDB, so if you want to send the post in response,
// change the key name of the object came out from mongo from _id to postID (if you want)

const spamSchema = mongoose.Schema({
  spammerID: {
    type: String,
    ref: "User",
  },
  spamType: String,
  spamText: String,
});

const voteSchema = mongoose.Schema({
  userID: {
    type: String /*mongoose.Schema.ObjectId,*/,
    ref: "User",
  },
  voteType: Number,
});

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "A post must have a title!"],
    trim: true, // Remove all the white space in the beginning or end of the field
    maxLength: [
      150,
      "A post title must have less than or equal to 150 characters",
    ],
    minLength: [1, "A post title must have more than or equal to 1 character"],
  },
  textHTML: {
    type: String,
    trim: true, // Remove all the white space in the beginning or end of the field
  },
  textJSON: {
    type: String,
    trim: true, // Remove all the white space in the beginning or end of the field
  },
  isDeleted: {
    type: Boolean,
    default: 0,
  },
  attachments: [String],
  spoiler: {
    type: Boolean,
    default: 0,
  },
  locked: {
    type: Boolean,
    default: 0,
  },
  type: {
    type: String,
    enum: ["link", "image", "linkWithImage"],
    default: "linkWithImage",
  },
  nsfw: {
    type: Boolean,
    default: 0,
  },
  insightCnt: {
    type: Number,
    default: 1,
  },
  spamCount: {
    type: Number,
    default: 0,
  },
  votesCount: {
    type: Number,
    default: 1,
  },
  flairID: String,
  flairText: String,
  flairTextColor: String,
  flairBackGround: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  editedAt: {
    type: Date,
  },
  followers: [
    {
      type: String,
    },
  ],
  communityID: {
    type: String,
    ref: "Community",
  },
  userID: {
    type: String,
    required: [true, "A post must have a user!"],
    ref: "User",
  },
  spammers: [
    {
      type: spamSchema,
    },
  ],
  voters: [
    {
      type: voteSchema,
    },
  ],
  mintionedInUsers: [
    {
      type: String,
      ref: "User",
    },
  ],
  commentsNum: Number,
  postComments: [
    {
      type: mongoose.Schema.ObjectId,
    },
  ],
});

postSchema.virtual("hotnessFactor").get(function () {
  return (
    ((this.createdAt.getMonth() / 12 +
      this.createdAt().getDay() / 30 +
      this.createdAt.getYear() / 2022) *
      2) /
      3 +
    this.votesCount +
    this.commentsNum
  );
});

postSchema.virtual("bestFactor").get(function () {
  return (
    ((this.createdAt.getMonth() / 12 +
      this.createdAt().getDay / 30 +
      this.createdAt.getYear() / 2022) *
      1) /
      3 +
    this.votesCount +
    this.commentsNum
  );
});

postSchema.post(/^find/, async function (doc, next) {
  await Post.updateMany(this.getFilter(), {
    $inc: { insightCnt: 1 },
  });
  next();
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
