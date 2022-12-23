const Service = require("./service");
const AppError = require("../utils/app-error");
const Post = require("../models/post-model");
const PostService = require("./post-service");
var postServiceInstance = new PostService(Post);
const CommunityRule = require("../models/submodels-model").CommunityRule;

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
   * @param {string} type icon ot banner
   * @returns {string} filename Name of the file
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
    const filename = file.filename;
    community[type] = filename;
    await community.save();
    return filename;
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
      "icon description category membersCnt"
    );
    return communities;
  };

  /**
   * Get a list of communities with a specific category
   * @param {object} query category, page, limit
   * @returns {array} communities
   * @function
   */
  getSpecificCategory = async (query) => {
    if (!query || !query.category)
      throw new AppError("No category specified!", 400);
    const category = query.category;
    delete query.category;
    query.fields = "icon,description,category,_id,membersCnt,rank";
    if (!query.limit) query.limit = 10; // limit one page to 10 communities
    const communities = await this.getAll(
      {
        category,
      },
      query
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
      // if tobeAffectedFound, it means that you are going to ban or mute a moderator, which is not valid behavior
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
   * Kick a user within a community
   * @param {string} subreddit
   * @param {string} moderator
   * @param {string} member
   * @returns {object} community
   * @function
   */
  kickAtCommunity = async (subreddit, moderator, member) => {
    const community = await this.getOne({
      _id: subreddit,
      select: "members moderators",
    });
    if (!community) throw new AppError("This subreddit doesn't exist!", 404);
    var performerFound = false;
    var toBeKickedFound = false;
    community.moderators.forEach((el) => {
      if (el.userID === moderator) performerFound = true;
      if (el.userID === member) toBeKickedFound = true;
    });
    if (!performerFound || toBeKickedFound)
      // if tobeKickedFound, it means that you are going to kick a moderator, which is not in this API
      throw new AppError(
        "You cannot make this operation this user in this subreddit!",
        400
      );
    community.members.splice(
      community.members.findIndex((el) => el.userID === member),
      1
    );
    return community;
  };

  /**
   * Saves the kick at the user side
   * @param {object} toBeKicked
   * @param {object} community
   * @returns {object} community
   * @function
   */
  kickAtUser = async (toBeKicked, community) => {
    if (!toBeKicked) throw new AppError("This user doesn't exist!", 404);
    toBeKicked.member.splice(
      toBeKicked.member.findIndex((el) => el.communityId === community._id),
      1
    );
    await toBeKicked.save();
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
   * @returns {object} {moderatorIDs, creatorID}
   * @function
   */
  getModerators = async (subreddit) => {
    const community = await this.getOne({
      _id: subreddit,
      select: "moderators",
    });
    if (!community) throw new AppError("This subreddit doesn't exist!", 404);
    const creator =
      community.moderators[
        community.moderators.findIndex((el) => el.role === "creator")
      ];
    var creatorID = undefined;
    if (creator) creatorID = creator.userID;
    var moderatorIDs = [];
    community.moderators.forEach((el) => {
      moderatorIDs.push(el.userID);
    });
    return { moderatorIDs, creatorID };
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
      select: "communityOptions description category categories",
    });
    if (!community) throw new AppError("This subreddit doesn't exist!", 404);
    var allOptions = { ...community.communityOptions }._doc;
    allOptions.description = community.description;
    allOptions.category = community.category;
    allOptions.categories = community.categories;
    return allOptions;
  };

  /**
   * Remove a spam from list of spams of a post or a comment
   * @param {object} link
   * @param {string} spamID
   * @param {string} commentOrPostField
   * @function
   */
  removeSpam = async (link, spamID, commentOrPost) => {
    link[commentOrPost].splice(
      link[commentOrPost].findIndex((el) => el._id === spamID),
      1
    );
    await link.save();
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
   * @param {string} type1 type of the stats required ("leftPerDay", "leftPerMonth", "joinedPerDay", "joinedPerMonth", "pageViewsPerDay", "pageViewsPerMonth")
   * @param {string} type1 type of the stats required ("leftPerDay", "leftPerMonth", "joinedPerDay", "joinedPerMonth", "pageViewsPerDay", "pageViewsPerMonth")
   * @returns {object} data
   * @function
   */
  getStats = async (subreddit, type1, type2) => {
    const community = await this.getOne({
      _id: subreddit,
      select: `${type1} ${type2}`,
    });
    if (!community) throw new AppError("This subreddit doesn't exist!", 404);
    return { days: community[type1], months: community[type2] };
  };
  /**
   * Get random subreddits of random categories
   * @param {string} query 
   * @returns {object} data
   * @function
   */
  getRandomCommunities = async (query) => {
    query.limit = query.limit || "10";
    return this.getAll({}, query);
    // const cursor = Community.find();
    // var communities = [];
    // for await (const doc of cursor) {
    //   communities.push(doc);
    // }
    // return communities;
  };
  /**
   * Check whether subreddit is available or not
   * @param {string} subreddit 
   * @returns {object} {state and subreddit}
   * @function
   */
  availableSubreddit = async (subreddit) => {
    var subre = await this.getOne({ _id: subreddit });
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

  /**
   * mark post in a commuity as spoiler
   * @param {string} subreddit
   * @param {string} moderator
   * @param {string} link
   * @function
   */
  markAsSpoiler = async (subreddit, moderator, link) => {
    const community = await this.getOne({
      _id: subreddit,
      select: "moderators",
    });
    if (!community) throw new AppError("This subreddit doesn't exist!", 404);
    let performerFound = false;
    community.moderators.forEach((el) => {
      if (el.userID === moderator) performerFound = true;
    });
    if (!performerFound)
      throw new AppError("You cannot make this operation!", 400);
    const post = await postServiceInstance.findById(link);
    if (!post) throw new AppError("This post doesn't exist!", 404);
    let linkID = false;
    if (post.communityID === subreddit) linkID = true;
    if (!linkID) throw new AppError("this post is not in this subreddit!", 400);
    post.spoiler = true;
    await post.save();
  };
  /**
   * mark post in a commuity as unspoiler
   * @param {string} subreddit
   * @param {string} moderator
   * @param {string} link
   * @function
   */
  markAsUnSpoiler = async (subreddit, moderator, link) => {
    const community = await this.getOne({
      _id: subreddit,
      select: "moderators",
    });
    const post = await postServiceInstance.findById(link);
    if (!community) throw new AppError("This subreddit doesn't exist!", 404);
    if (!post) throw new AppError("This post doesn't exist!", 404);
    let performerFound = false;
    community.moderators.forEach((el) => {
      if (el.userID === moderator) performerFound = true;
    });
    if (!performerFound)
      throw new AppError("You cannot make this operation!", 400);
    let linkID = false;
    if (post.communityID === subreddit) linkID = true;
    if (!linkID) throw new AppError("this post is not in this subreddit!", 400);
    post.spoiler = false;
    await post.save();
  };
  /**
   * mark post in a commuity as nsfw
   * @param {string} subreddit
   * @param {string} moderator
   * @param {string} link
   *  @param {string} action
   * @function
   */
  markAsNsfw = async (subreddit, moderator, link, action) => {
    const community = await this.getOne({
      _id: subreddit,
      select: "moderators",
    });
    const post = await postServiceInstance.findById(link);
    if (!community) throw new AppError("This subreddit doesn't exist!", 404);
    if (!post) throw new AppError("This post doesn't exist!", 404);
    let performerFound = false;
    community.moderators.forEach((el) => {
      if (el.userID === moderator) performerFound = true;
    });
    if (!performerFound)
      throw new AppError("You cannot make this operation!", 400);
    let linkID = false;
    if (post.communityID === subreddit) linkID = true;
    if (!linkID) throw new AppError("this post is not in this subreddit!", 400);
    if (action === "mark") {
      post.nsfw = true;
    } else if (action == "unmark") post.nsfw = false;
    await post.save();
  };

  /**
   * mark post in a commuity as unlocked
   * @param {string} subreddit
   * @param {string} moderator
   * @param {string} link
   * @function
   */
  markAsUnLocked = async (subreddit, moderator, link) => {
    const community = await this.getOne({
      _id: subreddit,
      select: "moderators",
    });
    const post = await postServiceInstance.findById(link);
    if (!community) throw new AppError("This subreddit doesn't exist!", 404);
    if (!post) throw new AppError("This post doesn't exist!", 404);
    let performerFound = false;
    community.moderators.forEach((el) => {
      if (el.userID === moderator) performerFound = true;
    });
    if (!performerFound)
      throw new AppError("You cannot make this operation!", 400);
    let linkID = false;
    if (post.communityID === subreddit) linkID = true;
    if (!linkID) throw new AppError("this post is not in this subreddit!", 400);
    post.locked = false;
    await post.save();
  };
  /**
   * mark post in a commuity as locked
   * @param {string} subreddit
   * @param {string} moderator
   * @param {string} link
   * @function
   */
  markAsLocked = async (subreddit, moderator, link) => {
    const community = await this.getOne({
      _id: subreddit,
      select: "moderators",
    });
    const post = await postServiceInstance.findById(link);
    if (!community) throw new AppError("This subreddit doesn't exist!", 404);
    if (!post) throw new AppError("This post doesn't exist!", 404);
    let performerFound = false;
    community.moderators.forEach((el) => {
      if (el.userID === moderator) performerFound = true;
    });
    if (!performerFound)
      throw new AppError("You cannot make this operation!", 400);
    let linkID = false;
    if (post.communityID === subreddit) linkID = true;
    if (!linkID) throw new AppError("this post is not in this subreddit!", 400);
    post.locked = true;
    await post.save();
  };

   /**
   * Add community rule
   * @param {string} body contain rules details
   * @param {string} user user information
   * @return {Object} state
   * @function
   */
  addCommunityRule = async (body, user) => {
    const result = await this.availableSubreddit(body.srName);
    if (result.state) {
      return {
        status: false,
        error: "subreddit is not found",
      };
    }
    var isFound = false;
    const moderators = result.subreddit.moderators;
    for (let i = 0; i < moderators.length; i++) {
      if (moderators[i].userID === user._id) {
        if (moderators[i].role === "creator") {
          isFound = true;
          break;
        }
      }
    }
    if (!isFound) {
      return {
        status: false,
        error: "you aren't a creator to this subreddit",
      };
    }
    const commRule = new CommunityRule({
      title: body.rule.title,
      description: body.rule.description,
      reason: body.rule.reason,
    });
    try {
      await this.updateOne(
        { _id: body.srName },
        { $addToSet: { communityRules: commRule } }
      );
    } catch {
      return {
        status: false,
        error: "operation failed",
      };
    }
    return {
      status: true,
      id: commRule._id,
      response: "rule is added successfully",
    };
  };
    /**
   * Edit community rule
   * @param {string} body contain rules details
   * @param {string} user user information
   * @return {Object} state
   * @function
   */
  editCommunityRule = async (body, user) => {
    const result = await this.availableSubreddit(body.srName);
    if (result.state) {
      return {
        status: false,
        error: "subreddit is not found",
      };
    }
    var isFound = false;
    const moderators = result.subreddit.moderators;
    for (let i = 0; i < moderators.length; i++) {
      if (moderators[i].userID === user._id) {
        if (moderators[i].role === "creator") {
          isFound = true;
          break;
        }
      }
    }
    if (!isFound) {
      return {
        status: false,
        error: "you aren't a creator to this subreddit",
      };
    }
    var ruleIsFound = false;
    var communityRules = result.subreddit.communityRules;
    for (let i = 0; i < communityRules.length; i++) {
      if (communityRules[i]._id.toString() == body.rule.id) {
        ruleIsFound = true;
        communityRules[i].title = body.rule.title;
        communityRules[i].description = body.rule.description;
        communityRules[i].reason = body.rule.reason;
      }
    }
    if (!ruleIsFound) {
      return {
        status: false,
        error: "invalid rule id",
      };
    }
    try {
      await this.updateOne(
        { _id: body.srName },
        { $set: { communityRules: communityRules } }
      );
    } catch {
      return {
        status: false,
        error: "operation failed",
      };
    }
    return {
      status: true,
      response: "rule is edited successfully",
    };
  };
    /**
   * Create subreddit
   * @param {string} body contain rules details
   * @param {string} user user information
   * @return {Object} state
   * @function
   */
  createSubreddit = async (body, user) => {
    if (!user.canCreateSubreddit) {
      return {
        status: false,
        error: "this user cannot create subreddit",
      };
    }
    const result = await this.availableSubreddit(body.name);
    if (!result.state) {
      return {
        errorType: 0,
        status: false,
        error: "subreddit is already made",
      };
    }
    const moderator = {
      userID: user._id,
      role: "creator",
    };
    const memInComm = {
      userID: user._id,
      isMuted: {
        value: false,
      },
      isBanned: {
        value: false,
      },
    };
    var mods = [moderator];
    var mems = [memInComm];
    const new_community = {
      _id: body.name,
      privacyType: body.type,
      over18: body.over18,
      moderators: mods,
      members: mems,
    };
    try {
      await this.insert(new_community);
      return {
        status: true,
        response: "subreddit created successfully",
      };
    } catch {
      return {
        errorType: 1,

        status: false,
        error: "operation failed",
      };
    }
  };
    /**
   * Validation of subreddit's attributes before creation
   * @param {string} body contain rules details
   * @return {Boolean} state
   * @function
   */
  creationValidation = async (body) => {
    if (
      !body.name ||
      body.name.substring(0, 2) !== "t5" ||
      !body.type ||
      body.over18 === null
    )
      return false;
    return true;
  };
 /**
   * Change the suggested comment sort of a subreddit
   * @param {string} srName subreddit name
   * @param {string} commentSort comment sort type
   * @return {Object} state {boolean}
   * @function
   */
  setSuggestedSort = async (srName, commentSort) => {
    var community = await this.getOne({
      _id: srName,
      select: "communityOptions",
    });
    if (!community) return { status: false };
    community.communityOptions.suggestedCommentSort = commentSort;
    console.log(commentSort);
    await community.save();
    console.log(community);
    return { status: true };
  };

  removeModeratorInvitation = async (subreddit, user) => {
    subreddit.invitedModerators.splice(
      subreddit.invitedModerators.findIndex((el) => el === user),
      1
    );
    return subreddit;
  };

  addModerator = async (subreddit, user) => {
    if (!subreddit.moderators.find((el) => el.userID === user)) {
      subreddit.moderators.push({ userID: user, role: "moderator" });
      await subreddit.save();
    }
  };
  /**
     * remove subreddit banner by moderator
     * @param {string} subreddit
     * @function
     */
  removeSrBanner = async (subreddit) => {
    await this.updateOne({ _id: subreddit }, { banner: "default.jpg" });
  };
  /**
   * remove subreddit icon by moderator
   * @param {string} subreddit
   * @function
   */
  removeSrIcon = async (subreddit) => {
    await this.updateOne({ _id: subreddit }, { icon: "default.jpg" });
  };

  /**
     * invite user to be moderator in subreddit
     * @param {string} subreddit
     * @param {string} moderator
     * @function
     */
  inviteModerator = async (subreddit, moderator) => {
    const doc = await this.getOne({ _id: subreddit });
    doc.invitedModerators.push(moderator);
    await doc.save();
  };
  /**
     * deinvite user to be moderator in subreddit
     * @param {string} subreddit
     * @param {string} moderator
     * @function
     */
  deInviteModerator = async (subreddit, moderator) => {
    const doc = await this.getOne({ _id: subreddit });
    doc.invitedModerators = doc.invitedModerators.filter(
      (el) => el != moderator
    );
    await doc.save();
  };

  /**
   * kick moderator of subreddit by creator
   * @param {string} subreddit
   * @param {string} moderator
   * @function
   */
  kickModerator = async (subreddit, moderator) => {
    let doc = await this.getOne({ _id: subreddit });
    console.log(doc.moderators);
    doc.moderators = doc.moderators.filter((el) => el.userID != moderator);
    await doc.save();
  };
  /**
   * check if user is moderatot in subreddit
   * @param {string} subreddit
   * @param {string} moderator
   * @function
   */
  isInvited = async (subreddit, user) => {
    const invitedModerators = (
      await this.getOne({ _id: subreddit, select: "invitedModerators" })
    ).invitedModerators;
    return invitedModerators.includes(user);
  };
}

module.exports = CommunityService;
