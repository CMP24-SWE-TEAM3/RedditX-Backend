/**
 * FILE: community-service
 * description: the services related to communities only
 * created at: 18/11/2022
 * created by: Mohamed Nabil
 * authors: Ahmed Lotfy, Shredan Abdullah, Moaz Mohamed, Mohamed Nabil
 */

const Service = require("./service");
const AppError = require("../utils/app-error");
const Community=require("../models/community-model");

/**
 * @namespace CommunityService
 */
class CommunityService extends Service {
  constructor(model) {
    super(model);
  }

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
   */
  getCommunities = async (user, type) => {
    if (!user) throw new AppError("This user doesn't exist!", 404);
    let communityIDs = [];
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
   */
  banOrMuteAtCommunity = async (subreddit, moderator, member, operation) => {
    const community = await this.getOne({
      _id: subreddit,
      select: "members moderators",
    });
    if (!community) throw new AppError("This subreddit doesn't exist!", 404);
    let performerFound = false;
    let toBeAffectedFound = false;
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
          ? (el.isBanned = true)
          : operation === "unban"
          ? (el.isBanned = false)
          : operation === "mute"
          ? (el.isMuted = true)
          : (el.isMuted = false)
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
   */
  banOrMuteAtUser = async (toBeAffected, community, operation) => {
    if (!toBeAffected) throw new AppError("This user doesn't exist!", 404);
    toBeAffected.member.map((el) =>
      el.communityId === community._id
        ? operation === "ban"
          ? (el.isBanned = true)
          : operation === "unban"
          ? (el.isBanned = false)
          : operation === "mute"
          ? (el.isMuted = true)
          : (el.isMuted = false)
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
   */
  getBannedOrMuted = async (subreddit, type) => {
    const community = await this.getOne({
      _id: subreddit,
      select: "members",
    });
    if (!community) throw new AppError("This subreddit doesn't exist!", 404);
    let memberIDs = [];
    community.members.forEach((el) => {
      if (el[type]) memberIDs.push(el.userID);
    });
    return memberIDs;
  };

  /**
   * Get all moderators of a community
   * @param {string} subreddit
   * @returns {Array} moderatorIDs
   */
  getModerators = async (subreddit) => {
    const community = await this.getOne({
      _id: subreddit,
      select: "moderators",
    });
    if (!community) throw new AppError("This subreddit doesn't exist!", 404);
    let moderatorIDs = [];
    community.moderators.forEach((el) => {
      moderatorIDs.push(el.userID);
    });
    return moderatorIDs;
  };

  /**
   * Get options of a community
   * @param {string} subreddit
   * @returns {object} communityOptions
   */
  getCommunityOptions = async (subreddit) => {
    const community = await this.getOne({
      _id: subreddit,
      select: "communityOptions",
    });
    if (!community) throw new AppError("This subreddit doesn't exist!", 404);
    return community.communityOptions;
  };
  getRandomCommunities=async()=>{
    const cursor = Community.find();
    var communities=[];
    for await (const doc of cursor) {
      communities.push(doc)  ;
    }
    return communities;
  }
  availableSubreddit=async(subreddit)=>{

    const subre = await this.getOne({_id:subreddit});
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
  }
}

module.exports = CommunityService;
