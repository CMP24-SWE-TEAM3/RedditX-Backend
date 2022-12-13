const mongoose = require("mongoose");

const communityRuleSchema = mongoose.Schema({
  title: String,
  description: String,
  reason: String,
});

const FAQSchema = mongoose.Schema({
  question: String,
  answer: String,
});

const flairSchema = mongoose.Schema({
  flairID: String,
  flairText: String,
  flairTextColor: String,
  flairBackGround: String,
  flairModOnly: {
    type: Boolean,
    default: 0,
  },
  flairAllowUserEdits: {
    type: Boolean,
    default: 0,
  },
});

const statsSchema = mongoose.Schema({
  date: String, // "1/1/2022"
  count: Number,
});

const communityOptionsSchema = mongoose.Schema({
  enableSpoilerTag: {
    type: Boolean,
    default: true,
  },
  emailUsernameMention: {
    type: Boolean,
    default: true,
  },
  nsfw: {
    type: Boolean,
    default: false,
  },
  welcomeMessage: String,
  allowImgAndLinksUploads: {
    type: Boolean,
    default: true,
  },
  allowMultipleImagePerPost: {
    type: Boolean,
    default: true,
  },
  suggestedCommentSort: {
    type: String,
    default: "best",
  },
  postType: Number, // 0 any, 1 videos and images only, and 2 text only
  region: String,
  privacyType: {
    type: String, // "public" (anyone can view and submit), "private" (only approved members can view and submit), or "restricted" (anyone can view, but only some are approved to submit links)
    default: "public",
  },
  spamsNumBeforeRemove: {
    type: Number,
    default: 20,
  },
});

const isBannedOrMutedSchema = mongoose.Schema({
  value: {
    type: Boolean,
    default: false,
  },
  date: Date,
});
const memberSchema = mongoose.Schema({
  userID: {
    type: String,
    ref: "User",
  },
  isMuted: {
    type: isBannedOrMutedSchema,
    default: () => ({}),
  },
  isBanned: {
    type: isBannedOrMutedSchema,
    default: () => ({}),
  },
});

const moderatorSchema = mongoose.Schema({
  userID: {
    type: String,
    ref: "User",
  },
  role: {
    type: String,
    enum: ["creator", "moderator"],
  },
});

const communitySchema = mongoose.Schema({
  _id: {
    type: String,
  },
  communityRules: [
    {
      type: communityRuleSchema,
    },
  ],
  description: {
    type: String,
    required: [false, "A community must have a description!"],
    trim: true, // Remove all the white space in the beginning or end of the field
    maxLength: [
      100000,
      "A community description must have less than or equal to 100000 characters",
    ],
    minLength: [
      1,
      "A community description must have more than or equal to 1 character",
    ],
  },
  banner: String,
  icon: String,
  membersCnt: {
    type: Number,
    default: 1,
  },
  FAQs: [
    {
      type: FAQSchema,
    },
  ],
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,

    required: [true, "missing the date of creation of the user"],
    default: Date.now(),
  },
  rank: {
    type: Number,
    default: 0,
  },
  trendPoints: {
    type: Number,
    default: 0,
  },

  pageViews: [
    // TODO: VERY IMPORTANT: if a user receives a listing from this community, you must search in this array for the today date,
    // if found it, increment the count, if not, create an object with the today date and make its count = 0
    {
      type: statsSchema,
    },
  ],
  joined: [
    // TODO: VERY IMPORTANT: if a user subscribes to this community, you must search in this array for the today date,
    // if found it, increment the count, if not, create an object with the today date and make its count = 0
    {
      type: statsSchema,
    },
  ],
  left: [
    // TODO: VERY IMPORTANT: if a user leaves this community, you must search in this array for the today date,
    // if found it, incerement the count, if not, create an object with the today date and make its count = 0
    {
      type: statsSchema,
    },
  ],
  flairList: [
    {
      type: flairSchema,
    },
  ],
  communityOptions: {
    type: communityOptionsSchema,
    default: () => ({}),
  },
  members: [
    {
      type: memberSchema,
    },
  ],
  moderators: [
    {
      type: moderatorSchema,
    },
  ],
  category: String,
  categories: [String],
});

const Community = mongoose.model("Community", communitySchema);

module.exports = Community;
