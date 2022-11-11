const User = require('./../models/user-model');

/**
 * Get user prefs from database
 * @param {String} (username)
 * @returns {object} user
 */
const userPrefs=async(username)=>{
  const user = await User.findById(username);
  if (user) {
    return {
      test:true,
      user: user.prefs,
    };
  }
  else {
    return {
      test:false,
      user: null,
    };
  }
};
/**
 * Get user prefs
 * @param {function} (req,res)
 * @returns {object} res
 */
const getUserPrefs = async(req,res)=>{
  const data= await userPrefs(req.params.username);
  if (data.test) {
    return res.status(200).json({
      data: data.user
    });
  } else {
    return res.status(404).json({
      response: "username is not found!",
    });
  }
};
/**
 * Get user me info from database
 * @param {String} (username)
 * @returns {object} user
 */
const userMe=async(username)=>{
  const user = await User.findById(username);
  if (user) {
  const obj={ 
  numComments: user.prefs.commentsNum,
  threadedMessages: user.prefs.threadedMessages,
  showLinkFlair: user.prefs.showLinkFlair,
  countryCode: user.prefs.countryCode,
  langauge: user.prefs.langauge,
  over18: user.prefs.over18,
  defaultCommentSort: user.prefs.defaultCommentSort,
  showLocationBasedRecommendations: user.prefs.showLocationBasedRecommendations,
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
    test:true,
    user: obj,
  };
}
else {
  return {
    test:false,
    user: null,
  };
}
  };
 /**
 * Get user me info 
 * @param {function} (req,,res)
 * @returns {object} res
 */ 
  const getUserMe = async(req,res)=>{
    const data= await userMe(req.params.username);
    if (data.test) {
      return res.status(200).json({
        data: data.user
      });
    } else {
      return res.status(404).json({
        response: "username is not found!",
      });
    }
      };

/**
 * Get user about from database
 * @param {String} (username)
 * @returns {object} user
 */
const userAbout=async(username)=>{
   const user = await User.findById(username);
    if (user) {
    const obj={ 
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
        test:true,
        user: obj,
      };
    }
    else {
      return {
        test:false,
        user: null,
      };
    }
    };
/**
 * Get user about 
 * @param {function} (req,res)
 * @returns {object} res
 */
    const getUserAbout = async(req,res)=>{
      const data= await userAbout(req.params.username);
      if (data.test) {
        return res.status(200).json({
          data: data.user
        });
      } else {
        return res.status(404).json({
          response: "username is not found!",
        });
      }
    }; 
    module.exports = {
      getUserMe,
      getUserAbout,
      getUserPrefs
    };
