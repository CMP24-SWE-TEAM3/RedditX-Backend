const Service = require("./service");
const AppError = require("./../utils/app-error");
const Email = require("./../utils/email");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Comment = require("../models/comment-model");
const Post = require("../models/post-model");
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
  saveNOtificationOfUser = (id, username) => {
    try {
      const user = this.updateOne(
        { _id: username },
        { $addToSet: { notifications: id } }
      );
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
    const followersUser = await this.getOne({ _id: username }).select(
      "followers"
    );
    const followersIds = followersUser.followers;

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
    var categories_user;
    try {
      categories_user = await this.updateOne(
        { _id: username },
        { categories: categories }
      );
    } catch {
      return {
        status: false,
      };
    }
    console.log(categories_user);
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
    console.log(id);
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
        var followerIndex = -1;
        var followerArr = result.user.followers;
        for (var i = 0; i < followerArr.length; i++) {
          if (followerArr[i] === username) {
            isFound = true;
            followerIndex = i;
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
        let index = -1;
        var memberArr = user.user.member;
        for (i = 0; i < memberArr.length; i++) {
          if (memberArr[i].communityId === body.srName) {
            isFound = true;
            index = i;
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
          console.log(dayIndex);
          console.log(monthIndex);
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
            const newUsr = await this.updateOne(
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
            const com = await communityServiceInstance.updateOne(
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
          console.log(err);
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
  getFilteredSubreddits = (subreddits) => {
    return subreddits.map((el) => {
      if (!el.isBanned.value) {
        return el.communityId;
      }
    });
  };

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
      console.log(el);
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
   * Get comments which is written by the user from database
   * @param {String} (username)
   * @returns {Array} Comments
   * @function
   */
  userComments = async (username, query) => {
    const user = await this.findById(username, "hasComment");
    if (!user) throw new AppError("This user doesn't exist!", 404);
    /*if the request didn't contain limit in its query then will add it to the query with 10 at default */
    if (!query.limit) {
      query.limit = "10";
    }
    var comments = [];
    user.hasComment.forEach((el) => {
      comments.push(el);
    });
    const cursor = Comment.find({
      _id: { $in: comments },
    });
    var returnComments = [];
    for await (const doc of cursor) {
      returnComments.push(doc);
    }
    return returnComments;
  };
  /**
   * Get replies on a comment written by the user from database
   * @param {String} (username)
   * @returns {Array} Comments
   * @function
   */
  userCommentReplies = async (username, query) => {
    const comment = await this.findById(username, "replies");
    if (!comment) throw new AppError("This comment doesn't exist!", 404);
    /*if the request didn't contain limit in its query then will add it to the query with 10 at default */
    if (!query.limit) {
      query.limit = "10";
    }
    var replies = [];
    comment.replies.forEach((el) => {
      replies.push(el);
    });
    const cursor = Comment.find({
      _id: { $in: replies },
    });
    var returnReplies = [];
    for await (const doc of cursor) {
      console.log(doc);
      returnReplies.push(doc);
    }
    return returnReplies;
  };
  /**
   * Get comments on posts of the user from database
   * @param {String} (username)
   * @returns {object} comments
   * @function
   */
  userSelfReply = async (username, query) => {
    const post = await this.findById(username, "postComments");
    if (!post) throw new AppError("This post doesn't exist!", 404);
    /*if the request didn't contain limit in its query then will add it to the query with 10 at default */
    if (!query.limit) {
      query.limit = "10";
    }
    var comments = [];
    post.postComments.forEach((el) => {
      comments.push(el);
    });
    const cursor = Comment.find({
      _id: { $in: comments },
    });
    var returnComments = [];
    for await (const doc of cursor) {
      console.log(doc);
      returnComments.push(doc);
    }
    return returnComments;
  };

  /**
   * Get posts which is written by the user from database
   * @param {String} (username)
   * @returns {Array} posts
   * @function
   */
  userSubmitted = async (username, query) => {
    const user = await this.findById(username, "hasPost");
    if (!user) throw new AppError("This user doesn't exist!", 404);
    /*if the request didn't contain limit in its query then will add it to the query with 10 at default */
    if (!query.limit) {
      query.limit = "10";
    }
    var posts = [];
    user.hasPost.forEach((el) => {
      posts.push(el);
    });
    const cursor = Post.find({
      _id: { $in: posts },
    });
    var returnPosts = [];
    for await (const doc of cursor) {
      returnPosts.push(doc);
    }
    return returnPosts;
  };
  /**
   * Get posts which downvoted by the user from database
   * @param {String} (username)
   * @returns {object} downVotes
   * @function
   */
  userDownVoted = async (username, query) => {
    const user = await this.findById(username, "hasVote");
    if (!user) throw new AppError("This user doesn't exist!", 404);
    /*if the request didn't contain limit in its query then will add it to the query with 10 at default */
    if (!query.limit) {
      query.limit = "10";
    }
    var downVotes = [];
    user.hasVote.forEach((el) => {
      if (el.type === -1) {
        downVotes.push(el.postID);
      }
    });
    const cursor = Post.find({
      _id: { $in: downVotes },
    });
    var returnPosts = [];
    for await (const doc of cursor) {
      returnPosts.push(doc);
    }
    return returnPosts;
  };
  /**
   * Get posts which upvoted by the user from database
   * @param {String} (username)
   * @returns {object} upVotes
   * @function
   */
  userUpVoted = async (username, query) => {
    const user = await this.findById(username, "hasVote");
    if (!user) throw new AppError("This user doesn't exist!", 404);
    console.log(user);
    /*if the request didn't contain limit in its query then will add it to the query with 10 at default */
    if (!query.limit) {
      query.limit = "10";
    }
    var upVotes = [];
    user.hasVote.forEach((el) => {
      if (el.type === 1) {
        upVotes.push(el.postID);
      }
    });
    console.log(upVotes);
    const cursor = Post.find({
      _id: { $in: upVotes },
    });
    var returnPosts = [];
    for await (const doc of cursor) {
      console.log(doc);
      returnPosts.push(doc);
    } //console.log(returnPosts);
    return returnPosts;
  };
  /**
   * Get posts where user is being mentioned in from database
   * @param {String} (username)
   * @returns {object} mentions
   * @function
   */
  userMentions = async (username, query) => {
    const user = await this.findById(username, "mentionedInPosts");
    if (!user) throw new AppError("This user doesn't exist!", 404);
    console.log(user);
    /*if the request didn't contain limit in its query then will add it to the query with 10 at default */
    if (!query.limit) {
      query.limit = "10";
    }
    //console.log(user);

    const cursor = Post.find({
      _id: { $in: user.mentionedInPosts },
    });
    var returnPosts = [];
    for await (const doc of cursor) {
      console.log(doc);
      returnPosts.push(doc);
    }
    return returnPosts;
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
      const x = await this.updateOne(
        { _id: user._id },
        { moderators: modarr, member: memarr }
      );
      console.log(x);
    } catch {
      console.log("dd");
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
  userSavedPosts = async (username, query) => {
    const user = await this.findById(username, "savedPosts");
    if (!user) throw new AppError("This user doesn't exist!", 404);
    console.log(user);
    /*if the request didn't contain limit in its query then will add it to the query with 10 at default */
    if (!query.limit) {
      query.limit = "10";
    }
    //console.log(user);

    const cursor = Post.find({
      _id: { $in: user.savedPosts },
    });
    let returnPosts = [];
    for await (const doc of cursor) {
      console.log(doc);
      returnPosts.push(doc);
    }
    return returnPosts;
  };
  /**
   * Get user about from database
   * @param {String} (username)
   * @returns {object} user
   */
  userAbout = async (username) => {
    const user = await User.findById(username);
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
        avatar: user.avatar,
        userID: user._id,
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
   */
  userMe = async (username) => {
    const user = await User.findById(username);
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
        avatar: user.avatar,
        userID: user._id,
        emailUserNewFollwer: user.meReturn.emailUserNewFollwer,
        emailUpVotePost: user.meReturn.emailUpVotePost,
        emailUsernameMention: user.meReturn.emailUsernameMention,
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
   */
  userPrefs = async (username) => {
    const user = await User.findById(username);
    if (user) {
      return {
        test: true,
        user: user.prefs,
      };
    } else {
      return {
        test: false,
        user: null,
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

  isParticipantInSubreddit = async (subreddit, user) => {
    let subreddits = (await this.getOne({ _id: user, select: "member" }))
      .member;
    subreddits = subreddits.map((el) => el.communityId);
    return subreddits.includes(subreddit);
  };

  isModeratorInSubreddit = async (subreddit, user) => {
    let subreddits = (await this.getOne({ _id: user, select: "moderators" }))
      .moderators;
    subreddits = subreddits.map((el) => el.communityId);
    return subreddits.includes(subreddit);
  };

  addSubredditModeration = async (subreddit, user) => {
    if (!user.moderators.find((el) => el.communityId === subreddit)) {
      user.moderators.push({ communityId: subreddit, role: "moderator" });
      await user.save();
    }
  };
}
module.exports = UserService;
