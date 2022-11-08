const mongoose = require("mongoose");

// postID here is the _id from mongoDB, so if you want to send the post in response,
// change the key name of the object came out from mongo from _id to postID (if you want)

const spamSchema = mongoose.Schema({
  spammerID: String,
  spamType: String,
  spamText: String,
});

const voteSchema = mongoose.Schema({
  userID: String,
  voteType: Number,
});

const postSchema = mongoose.Schema({

  _id: {
    type: String,
    minLength: [5, "the minimum length is 5 characters"],
    maxLength: [20, "the maximum length is 20"],
    required: [true, "this name isn't unique"],
    unique: [true, "the post must have an id"],
},
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
  text: {
    type: String,
    required: [true, "A post must have a text!"],
    trim: true, // Remove all the white space in the beginning or end of the field
    maxLength: [
      100000,
      "A post text must have less than or equal to 100000 characters",
    ],
    minLength: [1, "A post text must have more than or equal to 1 character"],
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
  createdAt: String,
  followers: [
    {
      type: String,
    },
  ],
  communityID: String,
  isApproved: {
    type: Boolean,
    default: 0,
  },
  userID: {
    type: String,
    required: [true, "A post must have a user!"],
  },
  spammers: [
    {
      type: spamSchema,
    },
  ],
  voters: [
    {
      type: voteSchema, // Do we need this?
    },
  ],
  mintionedInUsers: [
    {
      type: String,
    },
  ],
  commentsNum: Number,
});

postSchema.virtual("hotnessFactor").get(function () {
  return this.createdAt * 2 + this.votesCount + this.commentsNum;
});

postSchema.virtual("bestFactor").get(function () {
  return this.createdAt * 1 + this.votesCount + this.commentsNum;
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
