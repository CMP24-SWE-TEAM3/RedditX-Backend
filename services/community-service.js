const Service = require("./service");
const AppError = require("../utils/app-error");
const Community = require("../models/community-model");

/**
 * Service class to handle Community manipulations.
 * @class CommunityService
 */
class CommunityService extends Service {
  constructor(model) {
    super(model);
  }

  /**
   * Get search query results
   * @param {object} query
   * @function
   */
  getSearchResults = (query) => {
    const searchQuery = query.q;
    delete query.q;
    return this.getAll(
      {
        $or: [
          { _id: { $regex: searchQuery, $options: "i" } },
          { description: { $regex: searchQuery, $options: "i" } },
        ],
      },
      query
    );
  };

  /**
   * Uploads community icon or banner
   * @param {object} file
   * @param {string} username
   * @param {string} subreddit
   * @param {string} type
   * @function
   */
  uploadCommunityPhoto = async (file, username, subreddit, type) => {
    if (!file) throw new AppError("No photo is uploaded!", 400);
    const community = await this.getOne({
      _id: subreddit,
      select: "moderators icon banner",
    }); // Note that front passes for ex: t5_imagePro
    if (!community) throw new AppError("This subreddit doesn't exist!", 404);
    if (
      !community.moderators.find((moderator) => moderator.userID === username)
    )
      throw new AppError("You are not a moderator of this subreddit!", 401);
    community[type] = file.filename;
    await community.save();
  };

  /**
   * Get the list of communities that the user moderates or subscribes to them
   * @param {object} user
   * @param {string} type
   * @returns {array} communities
   * @function
   */
  getCommunities = async (user, type) => {
    if (!user) throw new AppError("This user doesn't exist!", 404);
    var communityIDs = [];
    user[type].forEach((el) => {
      communityIDs.push(el.communityId);
    });
    const communities = await this.find(
      {
        _id: { $in: communityIDs },
      },
      "icon description category"
    );
    return communities;
  };

  /**
   * Ban a user within a community
   * @param {string} subreddit
   * @param {string} moderator
   * @param {string} member
   * @param {string} operation
   * @returns {object} community
   * @function
   */
  banOrMuteAtCommunity = async (subreddit, moderator, member, operation) => {
    const community = await this.getOne({
      _id: subreddit,
      select: "members moderators",
    });
    if (!community) throw new AppError("This subreddit doesn't exist!", 404);
    var performerFound = false;
    var toBeAffectedFound = false;
    community.moderators.forEach((el) => {
      if (el.userID === moderator) performerFound = true;
      if (el.userID === member) toBeAffectedFound = true;
    });
    if (!performerFound || toBeAffectedFound)
      throw new AppError(
        "You cannot make this operation this user in this subreddit!",
        400
      );
    community.members.map((el) =>
      el.userID === member
        ? operation === "ban"
          ? ((el.isBanned.value = true), (el.isBanned.date = Date.now()))
          : operation === "unban"
          ? (el.isBanned.value = false)
          : operation === "mute"
          ? ((el.isMuted.value = true), (el.isMuted.date = Date.now()))
          : (el.isMuted.value = false)
        : el
    );
    return community;
  };

  /**
   * Saves the ban or mute at the user side
   * @param {object} toBeAffected
   * @param {object} community
   * @param {string} operation
   * @returns {object} community
   * @function
   */
  banOrMuteAtUser = async (toBeAffected, community, operation) => {
    if (!toBeAffected) throw new AppError("This user doesn't exist!", 404);
    toBeAffected.member.map((el) =>
      el.communityId === community._id
        ? operation === "ban"
          ? ((el.isBanned.value = true), (el.isBanned.date = Date.now()))
          : operation === "unban"
          ? (el.isBanned.value = false)
          : operation === "mute"
          ? ((el.isMuted.value = true), (el.isMuted.date = Date.now()))
          : (el.isMuted.value = false)
        : el
    );
    await toBeAffected.save();
    await community.save();
  };

  /**
   * Get all banned or muted users within a community
   * @param {string} subreddit
   * @param {string} type
   * @returns {Array} memberIDs
   * @returns {Array} dates
   * @function
   */
  getBannedOrMuted = async (subreddit, type) => {
    const community = await this.getOne({
      _id: subreddit,
      select: "members",
    });
    if (!community) throw new AppError("This subreddit doesn't exist!", 404);
    var memberIDs = [];
    var dates = [];
    community.members.forEach((el) => {
      if (el[type].value) {
        memberIDs.push(el.userID);
        dates.push(el[type].date);
      }
    });
    return { memberIDs, dates };
  };

  /**
   * Get all moderators of a community
   * @param {string} subreddit
   * @returns {Array} moderatorIDs
   * @function
   */
  getModerators = async (subreddit) => {
    const community = await this.getOne({
      _id: subreddit,
      select: "moderators",
    });
    if (!community) throw new AppError("This subreddit doesn't exist!", 404);
    var moderatorIDs = [];
    community.moderators.forEach((el) => {
      moderatorIDs.push(el.userID);
    });
    return moderatorIDs;
  };

  /**
   * Get all members of a community
   * @param {string} subreddit
   * @returns {Array} memberIDs
   * @returns {Array} isBannedAndMuted
   * @function
   */
  getMembers = async (subreddit) => {
    const community = await this.getOne({
      _id: subreddit,
      select: "members",
    });
    if (!community) throw new AppError("This subreddit doesn't exist!", 404);
    var memberIDs = [];
    var isBannedAndMuted = [];
    community.members.forEach((el) => {
      memberIDs.push(el.userID);
      isBannedAndMuted.push({ isBanned: el.isBanned, isMuted: el.isMuted });
    });
    return { memberIDs, isBannedAndMuted };
  };

  /**
   * Get options of a community
   * @param {string} subreddit
   * @returns {object} communityOptions
   * @function
   */
  getCommunityOptions = async (subreddit) => {
    const community = await this.getOne({
      _id: subreddit,
      select: "communityOptions",
    });
    if (!community) throw new AppError("This subreddit doesn't exist!", 404);
    return community.communityOptions;
  };

  /**
   * Get a list of things IDs from comma separated string
   * @param {string} ids
   * @returns {Array} thingsIDs
   * @function
   */
  getThingsIDs = (ids) => {
    if (!ids) throw new AppError("No IDs are provided!", 404);
    return ids.split(",");
  };

  /**
   * Get stats of a community
   * @param {string} subreddit
   * @param {string} type type of the stats required ("left", "joined", "pageViews")
   * @returns {object} data
   * @function
   */
  getStats = async (subreddit, type) => {
    const community = await this.getOne({
      _id: subreddit,
      select: type,
    });
    if (!community) throw new AppError("This subreddit doesn't exist!", 404);
    return community[type];
  };

  getRandomCommunities = async () => {
    const cursor = Community.find();
    var communities = [];
    for await (const doc of cursor) {
      communities.push(doc);
    }
    return communities;
  };
  availableSubreddit = async (subreddit) => {
    const subre = await this.getOne({ _id: subreddit });
    if (subre) {
      return {
        state: false,
        subreddit: subre,
      };
    } else {
      return {
        state: true,
        subreddit: null,
      };
    }
  };
  setSuggestedSort = async (srName, commentSort) => {
    Community.findByIdAndUpdate(
      { _id: srName },
      { $set: { suggestedCommentSort: commentSort } },
      { new: true },
      (err) => {
        if (err) {
          return {
            status: false,
          };
        } else {
          return {
            status: true,
          };
        }
      }
    );
  };
}

module.exports = CommunityService;
