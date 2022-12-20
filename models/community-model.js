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
  flairText: {
    type: String,
    default: "defaultString",
  },
  flairTextColor: {
    type: String,
  },
  flairBackGround: {
    type: String,
  },
  flairModOnly: {
    type: Boolean,
    default: 0,
  },
  flairAllowUserEdits: {
    type: Boolean,
    default: 0,
  },
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
  date: {
    type: Date,
    default: Date.now,
  },
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
  banner: {
    type: String,
    default: "default-banner.jpg",
  },
  icon: {
    type: String,
    default: "default-icon.jpg",
  },
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
  pageViewsPerDay: {
    type: Array,
    default: [0, 0, 0, 0, 0, 0, 0],
  }, // [0, 0, 0, 0, 0, 0, 0] 0 => sunday, 6 => saturday
  pageViewsPerMonth: {
    type: Array,
    default: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  }, // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] 0 => january, 11 => december
  joinedPerDay: {
    type: Array,
    default: [0, 0, 0, 0, 0, 0, 0],
  }, // [0, 0, 0, 0, 0, 0, 0] 0 => sunday, 6 => saturday
  joinedPerMonth: {
    type: Array,
    default: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  }, // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] 0 => january, 11 => december
  leftPerDay: {
    type: Array,
    default: [0, 0, 0, 0, 0, 0, 0],
  }, // [0, 0, 0, 0, 0, 0, 0] 0 => sunday, 6 => saturday
  leftPerMonth: {
    type: Array,
    default: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  }, // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] 0 => january, 11 => december
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
  invitedModerators: [
    {
      type: String,
      ref: "User",
    },
  ],
});

communitySchema.post(/^find/, async function (doc, next) {
  let filterOfDays = {};
  let filterOfMonths = {};
  filterOfDays[`pageViewsPerDay.${new Date().getDay()}`] = 1;
  filterOfMonths[`pageViewsPerMonth.${new Date().getMonth()}`] = 1;
  await Community.updateMany(this.getFilter(), {
    $inc: filterOfDays
  });
  await Community.updateMany(this.getFilter(), {
    $inc: filterOfMonths
  });
  next();
});

const Community = mongoose.model("Community", communitySchema);

module.exports = Community;
