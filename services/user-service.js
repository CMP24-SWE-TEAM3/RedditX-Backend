const Service = require("./service");
const AppError = require("./../utils/app-error");
const Email = require("./../utils/email");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user-model");
const Community = require("../models/community-model");
const AuthService = require("./../services/auth-service");
var authServiceInstance = new AuthService(User);
const CommunityService = require("./../services/community-service");
var communityServiceInstance = new CommunityService(Community);

/**
 * Service class to handle User manipulations.
 * @class UserService
 */
class UserService extends Service {
  constructor(model) {
    super(model);
  }
  /**
   * Signing the token
   * @param {String} emailType email type.
   * @param {String} username username of the user.
   * @returns {String} (signed token)
   * @function
   */
  signToken = (emailType, username) => {
    return jwt.sign(
      { emailType: emailType, username: username },
      "mozaisSoHotButNabilisTheHottest",
      { expiresIn: "120h" }
    );
  };
  /**
   * Saving notification in user's document
   * @param {String} id notification id.
   * @param {String} username username of the user.
   * @returns {Object} (status)
   * @function
   */
  saveNOtificationOfUser = async (id, username) => {
    const user = await this.getOne({ _id: username });
    const newNotification = {
      notificationID: id,
      isRead: false,
      isDeleted: false,
    };
    try {
      user.notifications.push(newNotification);
      user.save();
    } catch (err) {
      return {
        status: false,
        error: err,
      };
    }

    return {
      status: true,
    };
  };

  /**
   *  Get followers of me
   * @param {String} username my username .
   * @returns {Boolean} (state)
   * @function
   */
  getFollowers = async (username) => {
    const followers_user = await this.getOne({ _id: username }).select(
      "followers"
    );
    const followersIds = followers_user.followers;

    const followers = await this.find({
      _id: { $in: followersIds },
    }).select("about avatar _id");

    return {
      status: true,
      followers: followers,
    };
  };

  /**
   * Get people that I follow
   * @param {String} username my username .
   * @returns {object}
   * @function
   */
  getFollowing = async (username) => {
    if (!username) throw new AppError("No username is provided!", 400);
    const user = await this.getOne({ _id: username, select: "follows" });
    if (!user) throw new AppError("User is not found!", 404);
    const followingIds = user.follows;
    const following = await this.getAll(
      {
        _id: { $in: followingIds },
      },
      { fields: "about,avatar,_id" }
    );
    return {
      status: true,
      following,
    };
  };

  /**
   *  Get followers of user
   * @param {String} username my username .
   * @returns {Boolean} (state)
   * @function
   */
  getFollowersOfUser = async (username) => {
    const followers_user = await this.getOne({ _id: username }).select(
      "followers"
    );
    const followersIds = followers_user.followers;

    const followers = await this.find({
      _id: { $in: followersIds },
    });
    return {
      status: true,
      followers: followers,
    };
  };
  /**
   *  Get interests of me
   * @param {String} username my username .
   * @returns {Boolean} (state)
   * @function
   */
  getInterests = async (username) => {
    var categories_user;
    try {
      categories_user = await this.getOne({ _id: username });
    } catch {
      return {
        status: false,
      };
    }
    const categories = categories_user.categories;
    return {
      status: true,
      categories: categories,
    };
  };

  /**
   *  Add interests of me
   * @param {String} username my username .
   * @returns {Boolean} (state)
   * @function
   */
  addInterests = async (username, categories) => {
    try {
      await this.updateOne({ _id: username }, { categories: categories });
    } catch {
      return {
        status: false,
      };
    }
    return {
      status: true,
    };
  };

  /**
   * Subscribe to a subreddit or redditor
   * @param {String} body body contains the information.
   * @returns {Boolean} (state)
   * @function
   */
  subscribe = async (body, username) => {
    const id = body.srName.substring(0, 2);
    const action = body.action;
    if (id === "t2") {
      //check the username
      const result = await authServiceInstance.availableUser(body.srName);
      if (result.state) {
        return {
          state: false,
          error: "invalid username",
        };
      } else {
        const avatar = result.user.avatar;

        var isFound = false;
        var followerArr = result.user.followers;
        for (var i = 0; i < followerArr.length; i++) {
          if (followerArr[i] === username) {
            isFound = true;
            break;
          }
        }

        try {
          if (action === "sub") {
            if (isFound) {
              return {
                state: false,
                error: "already followed",
              };
            }

            await this.updateOne(
              { _id: username },
              { $addToSet: { follows: body.srName } }
            );
            await this.updateOne(
              { _id: body.srName },
              { $addToSet: { followers: username } }
            );
          } else {
            if (!isFound) {
              return {
                state: false,
                error: "operation failed the user is already not followed",
              };
            }
            await this.updateOne(
              { _id: username },
              { $pull: { follows: body.srName } }
            );
            await this.updateOne(
              { _id: body.srName },
              { $pull: { followers: username } }
            );
          }
        } catch {
          return {
            state: false,
            error: "error",
          };
        }
        return {
          state: true,
          error: null,
          avatar: avatar,
        };
      }
    } else if (id === "t5") {
      const result = await communityServiceInstance.availableSubreddit(
        body.srName
      );
      if (result.state) {
        return {
          state: false,
          error: "invalid subreddit",
        };
      } else {
        const user = await authServiceInstance.availableUser(username);
        if (user.state) {
          return {
            state: false,
            error: "invalid username",
          };
        }
        let isFound = false;
        var memberArr = user.user.member;
        for (i = 0; i < memberArr.length; i++) {
          if (memberArr[i].communityId === body.srName) {
            isFound = true;
            break;
          }
        }
        try {
          var memCom = result.subreddit.members;
          var memCnt = result.subreddit.membersCnt;
          var joinedPerDay = result.subreddit.joinedPerDay;
          var joinedPerMonth = result.subreddit.joinedPerMonth;
          var leftPerDay = result.subreddit.leftPerDay;
          var leftPerMonth = result.subreddit.leftPerMonth;

          const date = new Date();
          var dayIndex = date.getDay();
          var monthIndex = date.getMonth();
          if (action === "sub") {
            if (isFound) {
              return {
                state: false,
                error: "already followed",
              };
            }
            joinedPerDay[dayIndex]++;
            joinedPerMonth[monthIndex]++;

            const memUser = user.user.member;
            memUser.push({
              communityId: body.srName,
              isBanned: {
                value: false,
                date: Date.now(),
              },
              isMuted: {
                value: false,
                date: Date.now(),
              },
            });
            await this.updateOne(
              { _id: username },
              {
                member: memUser,
              }
            );
            memCnt++;
            memCom.push({
              userID: username,
              isBanned: {
                value: false,
                date: Date.now(),
              },
              isMuted: {
                value: false,
                date: Date.now(),
              },
            });
            await communityServiceInstance.updateOne(
              { _id: body.srName },
              {
                members: memCom,
                membersCnt: memCnt,
                joinedPerDay: joinedPerDay,
                joinedPerMonth: joinedPerMonth,
              }
            );
          } else {
            if (!isFound) {
              return {
                state: false,
                error: "operation failed the user is already not followed",
              };
            }
            leftPerDay[dayIndex]++;
            leftPerMonth[monthIndex]++;
            memCnt--;
            var memIndex = -1;
            console.log(memCom);
            for (let x = 0; x < memCom.length; x++) {
              if (memCom[x].userID === username) {
                memIndex = x;
              }
            }
            memCom.splice(memIndex, 1);
            await this.updateOne(
              { _id: username },
              { $pull: { member: { communityId: body.srName } } }
            );

            await communityServiceInstance.updateOne(
              { _id: body.srName },
              {
                members: memCom,
                membersCnt: memCnt,
                leftPerDay: leftPerDay,
                leftPerMonth: leftPerMonth,
              }
            );
          }
        } catch (err) {
          return {
            state: false,
            error: "error",
          };
        }
        return {
          state: true,
          error: null,
        };
      }
    }
  };
  /**
   * filter subreddits to filter banned subreddits
   * @param {object} subreddits
   * @returns {Promise} users
   * @function
   */
  getFilteredSubreddits = (subreddits) => {
    return subreddits.map((el) => {
      if (!el.isBanned.value) {
        return el.communityId;
      }
    });
  };
  /**
   * add user filter
   * @param {object} query
   * @param {string} username
   * @returns {Promise} users
   * @function
   */
  addUserFilter = async (username) => {
    /*step 1,2 :get the categories and friends of the user*/
    const { member, friend, follows } = await this.getOne({
      _id: username,
      select: "member friend follows",
    });
    const subreddits = this.getFilteredSubreddits(member);

    /* step 3 :add the subreddits to addedFilter*/
    const addedFilter = {
      $or: [
        {
          communityID: {
            $in: subreddits,
          },
        },
        {
          userID: {
            $in: friend,
          },
        },
        {
          userID: {
            $in: follows,
          },
        },
      ],
    };
    return addedFilter;
  };
  /**
   * get users based on query search
   * @param {object} query
   * @param {string} username
   * @returns {Promise} users
   * @function
   */
  getSearchResults = async (query, username) => {
    const searchQuery = query.q;
    delete query.q;
    var users = await this.getAll(
      {
        $or: [
          { _id: { $regex: searchQuery, $options: "i" } },
          { about: { $regex: searchQuery, $options: "i" } },
        ],
      },
      query
    );

    const { follows } = await this.getOne({
      _id: username,
      select: "-_id follows",
    });
    users = users.map((el) => {
      el.follow = follows.indexOf(el._id) != -1;
      delete el.prefs;
      return el;
    });
    return users;
  };

  /**
   * Saves filename to database
   * @param {object} data
   * @param {string} username
   * @param {object} file
   * @returns {string} avatar Name of the file
   * @function
   */
  uploadUserPhoto = async (action, username, file) => {
    if (!action)
      throw new AppError("No attachment or action is provided!", 400);
    var avatar = "default.jpg";
    if (action === "upload") {
      if (!file) throw new AppError("No photo is uploaded!", 400);
      avatar = file.filename;
    }
    await this.findByIdAndUpdate(username, { avatar }, { runValidators: true });
    return avatar;
  };

  /**
   * Blocks another user
   * @param {string} from
   * @param {string} to
   * @param {boolean} action
   * @function
   */
  block = async (from, to, action) => {
    if (!to) throw new AppError("No username is provided!", 400);
    const toUser = await this.getOne({ _id: to, select: "blocksToMe" });
    const myUser = await this.getOne({ _id: from, select: "blocksFromMe" });
    if (!toUser || !myUser) throw new AppError("This user doesn't exist!", 404);
    if (action === true) {
      // block
      if (toUser.blocksToMe.find((el) => el === from)) return;
      if (myUser.blocksFromMe.find((el) => el === to)) return;
      myUser.blocksFromMe.push(to);
      toUser.blocksToMe.push(from);
    } else {
      // unblock
      myUser.blocksFromMe.splice(
        myUser.blocksFromMe.findIndex((el) => el === to),
        1
      );
      toUser.blocksToMe.splice(
        toUser.blocksToMe.findIndex((el) => el === from),
        1
      );
    }
    await myUser.save();
    await toUser.save();
  };

  /**
   * Sends the username to the specified email
   * @param {string} email
   * @function
   */
  forgotUsername = async (email) => {
    const user = await this.getOne({ email });
    if (!user)
      throw new AppError("There is no user with this email address!", 404);
    try {
      await new Email(user, "none").sendUsername();
    } catch (err) {
      throw new AppError("There was an error in sending the mail!", 500);
    }
  };

  /**
   * Sends reset link to specified user by email
   * @param {string} username
   * @function
   */
  forgotPassword = async (username) => {
    const user = await this.getOne({ _id: username });
    if (!user) {
      throw new AppError("There is no user with this username!", 404);
    }
    // Generate the random reset token
    const resetToken = await user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false }); // in order to save the passwordResetToken and passwordResetExpires
    // Send the reset token to the user email
    try {
      const reqURL = `http://dev.redditswe22.tech/user/reset-password/${resetToken}`;
      await new Email(user, reqURL).sendPasswordReset();
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      throw new AppError("There was an error in sending the mail!", 500);
    }
  };

  /**
   * Get posts which is written by the user from database
   * @param {String} (username)
   * @returns {Array} posts
   * @function
   */
  userSubmittedPosts = async (username) => {
    const user = await this.findById(username, "hasPost");
    if (!user) throw new AppError("This user doesn't exist!", 404);
    var posts = [];
    user.hasPost.forEach((el) => {
      posts.push(el);
    });
    return posts;
  };
  /**
   * Get comments which is written by the user from database
   * @param {String} (username)
   * @returns {Array} posts
   * @function
   */
  userSubmittedComments = async (username) => {
    const user = await this.findById(username, "hasComment");
    if (!user) throw new AppError("This user doesn't exist!", 404);
    var comments = [];
    user.hasComment.forEach((el) => {
      comments.push(el);
    });
    return comments;
  };
  /**
   * Get replies which is written by the user from database
   * @param {String} (username)
   * @returns {Array} posts
   * @function
   */
  userSubmittedReplies = async (username) => {
    const user = await this.findById(username, "hasReply");
    if (!user) throw new AppError("This user doesn't exist!", 404);
    var replies = [];
    user.hasReply.forEach((el) => {
      replies.push(el);
    });
    return replies;
  };
  /**
   * Get posts which downvoted by the user from database
   * @param {String} (username)
   * @returns {object} downVotes
   * @function
   */
  userDownVoted = async (username) => {
    const user = await this.findById(username, "hasVote");
    if (!user) throw new AppError("This user doesn't exist!", 404);
    var downVotes = [];
    user.hasVote.forEach((el) => {
      if (el.type === -1) {
        downVotes.push(el.postID);
      }
    });
    return downVotes;
  };
  /**
   * Get posts which upvoted by the user from database
   * @param {String} (username)
   * @returns {object} upVotes
   * @function
   */
  userUpVoted = async (username) => {
    const user = await this.findById(username, "hasVote");
    if (!user) throw new AppError("This user doesn't exist!", 404);
    var upVotes = [];
    user.hasVote.forEach((el) => {
      if (el.type === 1) {
        upVotes.push(el.postID);
      }
    });
    return upVotes;
  };
  /**
   * Get posts where user is being mentioned in from database
   * @param {String} (username)
   * @returns {object} mentions
   * @function
   */
  userMentions = async (username) => {
    const user = await this.findById(username, "mentionedInPosts");
    if (!user) throw new AppError("This user doesn't exist!", 404);
    return user.mentionedInPosts;
  };
  /**
   * Add user to community
   * @param {String} (username)
   * @param {String} (communityID)
   * @returns {object} mentions
   * @function
   */
  addUserToComm = async (user, communityID) => {
    const userModerator = {
      communityId: communityID,
      role: "creator",
    };
    const userMember = {
      communityId: communityID,
      isMuted: {
        value: false,
      },
      isBanned: {
        value: false,
      },
    };
    const modarr = user.moderators;
    modarr.push(userModerator);
    const memarr = user.member;
    memarr.push(userMember);
    try {
      await this.updateOne(
        { _id: user._id },
        { moderators: modarr, member: memarr }
      );
    } catch {
      return {
        status: false,
        error: "operation failed",
      };
    }
    return {
      status: true,
    };
  };
  /**
   * Get posts where is saved by the user in from database
   * @param {String} (username)
   * @returns {object} saved posts
   * @function
   */
  userSavedPosts = async (username) => {
    const user = await this.findById(username, "savedPosts");
    if (!user) throw new AppError("This user doesn't exist!", 404);
    var posts = [];
    user.savedPosts.forEach((el) => {
      posts.push(el);
    });
    return posts;
  };
  /**
   * Get user about from database
   * @param {String} (username)
   * @returns {object} user
   * @function
   */
  userAbout = async (username) => {
    const user = await this.findById(username);
    if (!user) throw new AppError("This user doesn't exist!", 404);
    if (user) {
      const obj = {
        followerCount: user.followers.length,
        prefShowTrending: user.aboutReturn.prefShowTrending,
        isBlocked: user.aboutReturn.isBlocked,
        isBanned: user.member.isBanned,
        isMuted: user.member.isMuted,
        canCreateSubreddit: user.canCreateSubreddit,
        isMod: user.aboutReturn.isMuted,
        over18: user.prefs.over18,
        hasVerifiedEmail: user.hasVerifiedEmail,
        createdAt: user.createdAt,
        inboxCount: user.inboxCount,
        totalKarma: user.karma,
        linkKarma: user.postKarma,
        acceptFollowers: user.aboutReturn.acceptFollowers,
        commentKarma: user.commentKarma,
        passwordSet: user.isPasswordSet,
        email: user.email,
        about: user.about,
        gender: user.gender,
        avatar: user.avatar,
        userID: user._id,
        showActiveCommunities: user.showActiveCommunities,
      };
      return {
        user: obj,
      };
    } else {
      return {
        user: null,
      };
    }
  };
  /**
   * Get user me info from database
   * @param {String} (username)
   * @returns {object} user
   * @function
   */
  userMe = async (username) => {
    const user = await this.findById(username);
    if (!user) throw new AppError("This user doesn't exist!", 404);
    if (user) {
      const obj = {
        numComments: user.prefs.commentsNum,
        threadedMessages: user.prefs.threadedMessages,
        showLinkFlair: user.prefs.showLinkFlair,
        countryCode: user.prefs.countryCode,
        langauge: user.prefs.langauge,
        over18: user.prefs.over18,
        defaultCommentSort: user.prefs.defaultCommentSort,
        showLocationBasedRecommendations:
          user.prefs.showLocationBasedRecommendations,
        searchInclude18: user.prefs.searchInclude18,
        publicVotes: user.prefs.publicVotes,
        enableFollwers: user.prefs.enableFollwers,
        liveOrangeRed: user.prefs.liveOrangereds,
        labelNSFW: user.prefs.labelNSFW,
        newWindow: user.prefs.showPostInNewWindow,
        emailPrivateMessage: user.prefs.emailPrivateMessage,
        emailPostReply: user.prefs.emailPostReply,
        emailMessages: user.prefs.emailMessages,
        emailCommentReply: user.prefs.emailCommentReply,
        emailUpvoteComment: user.prefs.emailUpvoteComment,
        about: user.about,
        gender: user.gender,
        avatar: user.avatar,
        userID: user._id,
        emailUserNewFollwer: user.meReturn.emailUserNewFollwer,
        emailUpVotePost: user.meReturn.emailUpVotePost,
        emailUsernameMention: user.meReturn.emailUsernameMention,
        showActiveCommunities: user.showActiveCommunities,
      };
      return {
        user: obj,
      };
    } else {
      return {
        user: null,
      };
    }
  };
  /**
   * Get user prefs from database
   * @param {String} (username)
   * @returns {object} user
   * @function
   */
  userPrefs = async (username) => {
    const user = await this.findById(username);
    if (!user) throw new AppError("This user doesn't exist!", 404);
    const prefs = await this.getOne({ _id: username }).select("prefs");
    if (prefs) {
      return {
        userPrefs: prefs,
      };
    } else {
      return {
        userPrefs: null,
      };
    }
  };

  /**
   * Resets user password
   * @param {string} currentPassword
   * @param {string} newPassword
   * @param {string} confirmedNewPassword
   * @function
   */
  resetPassword = async (
    username,
    currentPassword,
    newPassword,
    confirmedNewPassword
  ) => {
    const user = await this.getOne({ _id: username });
    if (!user) throw new AppError("user is invalid or expired!", 400);
    if (confirmedNewPassword !== newPassword)
      throw new AppError("Password is not equal to confirmed password!", 400);
    const result = await bcrypt.compare(currentPassword, user.password);

    if (!result) throw new AppError("this password is not correct!", 400);
    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await user.save();
  };

  /**
   * Resets user password and returns a new token
   * @param {string} token
   * @param {string} newPassword
   * @param {string} confirmedNewPassword
   * @returns {object} object
   * @function
   */
  resetForgottenPassword = async (token, newPassword, confirmedNewPassword) => {
    // Get user with token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await this.getOne({
      passswordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    // If token is not expired and there is a user, set the new password
    if (!user) throw new AppError("Link is invalid or expired!", 400);
    if (confirmedNewPassword !== newPassword)
      throw new AppError("Password is not equal to confirmed password!", 400);
    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    // Log the user in: send JWT
    const newToken = await this.signToken("bare email", user._id);
    return { token: newToken, id: user._id };
  };

  /**
 * get if participant in subreddit
 * @param {String} (subreddit)
 * @param {String} (user)
 * @function
 */
  isParticipantInSubreddit = async (subreddit, user) => {
    let subreddits = (await this.getOne({ _id: user, select: "member" }))
      .member;
    subreddits = subreddits.map((el) => el.communityId);
    return subreddits.includes(subreddit);
  };
  /**
 * isModeratorInSubreddit
 * @param {String} (subreddit)
 * @param {String} (user)
 * @function
 */
  isModeratorInSubreddit = async (subreddit, user) => {
    let subreddits = (await this.getOne({ _id: user, select: "moderators" }))
      .moderators;
    subreddits = subreddits.map((el) => el.communityId);
    return subreddits.includes(subreddit);
  };
  /**
 * addSubredditModeration
 * @param {String} (subreddit)
 * @param {String} (user)
 * @function
 */
  addSubredditModeration = async (subreddit, user) => {
    if (!user.moderators.find((el) => el.communityId === subreddit)) {
      user.moderators.push({ communityId: subreddit, role: "moderator" });
      await user.save();
    }
  };

  /**
 * add friend of user
 * @param {String} (username)
 * @param {String} (friend)
 * @function
 */
  addFriend = async (username, friend) => {
    await this.updateOne(
      { _id: username },
      {
        $addToSet: {
          friendRequestFromMe: friend,
        },
      }
    );
    await this.updateOne(
      { _id: friend },
      {
        $addToSet: {
          friendRequestToMe: username,
        },
      }
    );
  };

  /**
   * delete friend of user 
   * @param {String} (username)
   * @param {String} (friend)
   * @function
   */
  deleteFriend = async (username, friend) => {
    await this.updateOne(
      { _id: username },
      {
        $pull: {
          friend: friend,
        },
      }
    );
  };
  /**
   * get if the user is creator of the subreddit
   * @param {String} (subreddit)
   * @param {String} (user)
   * @function
   */
  isCreatorInSubreddit = async (subreddit, user) => {
    let subreddits = (await this.getOne({ _id: user, select: "moderators" }))
      .moderators;
    subreddits = subreddits
      .filter((el) => el.role == "creator")
      .map((el) => el.communityId);
    return subreddits.includes(subreddit);
  };

  /**
   * kick moderator of subreddit
   * @param {String} (subreddit)
   * @param {String} (user)
   * @function
   */
  kickModerator = async (subreddit, user) => {
    let doc = await this.getOne({ _id: user });
    doc.moderators = doc.moderators.filter((el) => el.communityId != subreddit);
    await doc.save();
  };
}
module.exports = UserService;
