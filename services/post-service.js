const Service = require("./service");
const AppError = require("./../utils/app-error");

/**
 * Service class to handle Post manipulations.
 * @class PostService
 */
class PostService extends Service {
  constructor(model) {
    super(model);
  }

  addSortCriteria(criteria) {
    let sort = {};
    if (criteria) {
      if (criteria === "best")
        sort = {
          bestFactor: -1,
        };
      else if (criteria === "hot")
        sort = {
          hotnessFactor: -1,
        };
      else if (criteria === "new") {
        sort = {
          createdAt: -1,
        };
      } else if (criteria === "top")
        sort = {
          votesCount: -1,
        };
      else if (criteria === "random") {
        sort = {};
      } else {
        /*if the request has any other criteria */
        return new AppError("not found this page", 404);
      }
    }
    return sort;
  }

  getListingPosts = async (params, query, addedFilter) => {
    /*first of all : check if the request has certain subreddit or not*/
    let sort = this.addSortCriteria(params.criteria);
    /*if the request didn't contain limit in its query then will add it to the query with 10 at default */
    query.limit = query.limit || "10";
    /*return posts to controller */
    return await this.getAll(addedFilter, query).sort(sort); //addedFilter contain either the subreddit or the information of signedin user
  };

  getSearchResults = (query) => {
    const searchQuery = query.q;
    delete query.q;
    return this.getAll(
      {
        $or: [{ text: { $regex: searchQuery, $options: "i" } }],
      },
      query
    );
  };

  /**
   * User saves a post
   * @param {string} linkID
   * @param {object} user
   * @function
   */
  save = async (linkID, user) => {
    if (!linkID) throw new AppError("No linkID is provided!", 400);
    if (!user) throw new AppError("This user doesn't exist!", 404);
    if (user.savedPosts.find((el) => el.toString() === linkID.slice(3))) return;
    user.savedPosts.push(linkID.slice(3));
    await user.save();
  };

  /**
   * User unsaves a post
   * @param {string} linkID
   * @param {object} user
   * @function
   */
  unsave = async (linkID, user) => {
    if (!linkID) throw new AppError("No linkID is provided!", 400);
    if (!user) throw new AppError("This user doesn't exist!", 404);
    user.savedPosts.splice(
      user.savedPosts.findIndex((el) => el === linkID.slice(3)),
      1
    );
    await user.save();
  };

  /**
   * Creates a post and saves the file names to database
   * @param {object} data
   * @param {Array} files
   * @param {object} user
   * @param {object} community
   * @returns {object} newPost
   * @function
   */
  submit = async (data, files, user, community) => {
    if (!user) throw new AppError("This user doesn't exist!", 404);
    data.attachments = [];
    if (files) {
      files.forEach((file) => data.attachments.push(file.filename));
    }
    data.userID = user._id;
    data.voters = [{ userID: user._id, voteType: 1 }];
    if (community) {
      if (
        community.communityOptions.privacyType === "private" ||
        community.communityOptions.privacyType === "restricted"
      ) {
        const memberOf = user.member.find(
          (el) => el.communityId === community._id
        );
        if (!memberOf || memberOf.isMuted.value || memberOf.isBanned.value)
          throw new AppError("You cannot submit a post to this subreddit", 400);
      }
    }
    const newPost = await this.insert(data);
    user.hasPost.push(newPost._id);
    await user.save();
    return newPost;
  };

  /**
   * Spams a post
   * @param {object} post
   * @param {string} spamType
   * @param {string} spamText
   * @param {string} username
   * @param {string} community
   * @function
   */
  spamPost = async (post, spamType, spamText, username, community) => {
    if (post.spammers.find((el) => el.spammerID === username))
      throw new AppError("You spammed this post before!");
    post.spammers.push({
      spammerID: username,
      spamType,
      spamText,
    });
    post.spamCount++;
    if (community) {
      if (
        community &&
        post.spamCount >= community.communityOptions.spamsNumBeforeRemove
      )
        post.isDeleted = true;
    }
    await post.save();
  };
 /**
   * User hides a post
   * @param {string} linkID
   * @param {object} user
   * @function
   */
 hide = async (linkID, user) => {
  if (!linkID) throw new AppError("No linkID is provided!", 400);
  if (!user) throw new AppError("This user doesn't exist!", 404);
  if (user.hiddenPosts.find((el) => el.toString() === linkID.slice(3))) return;
  user.hiddenPosts.push(linkID.slice(3));
  await user.save();
};

/**
 * User unhides a post
 * @param {string} linkID
 * @param {object} user
 * @function
 */
unhide = async (linkID, user) => {
  if (!linkID) throw new AppError("No linkID is provided!", 400);
  if (!user) throw new AppError("This user doesn't exist!", 404);
  user.hiddenPosts.splice(
    user.hiddenPosts.findIndex((el) => el === linkID.slice(3)),1
  );
  await user.save();
};
 /**
   * User delete a post
   * @param {string} linkID
   * @function
   */
 deletePost = async (linkID) => {
  const post = await this.getOne({_id: linkID });
  if (!post) throw new AppError("linkID doesn't exist!", 404);
  post.isDeleted = true;
  await post.save();
};

}

module.exports = PostService;
