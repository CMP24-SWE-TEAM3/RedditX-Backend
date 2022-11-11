const AppError = require("../utils/app-error");
const catchAsync = require("../utils/catch-async");
const User = require('./../models/user-model');
//const factory = require("./handler-factory");
const makeRandomString = require("../utils/randomString");
const sharp = require("sharp");

const userPrefs=async(username)=>{
  const user = await User.findById(username);
  if (user) {
    return {
      test:true,
      "user": user.prefs,
    };
  }
  else {
    return {
      test:false,
      "user": null,
    };
  }
};
const getUserPrefs = async(req,res)=>{
  const data= await userPrefs(req.params.username);
  if (data.test) {
    return res.status(200).json({
      status: "success",
      data: data
    });
  } else {
    return res.status(404).json({
      response: "username is not found!",
    });
  }
};
const userMe=async(username)=>{
  const user = await User.findById(username);
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
  numComments: user.meReturn.numComments,
  emailUserNewFollwer: user.meReturn.emailUserNewFollwer,
  emailUpVotePost: user.meReturn.emailUpVotePost,
  emailUsernameMention: user.meReturn.emailUsernameMention,
};
if (user) {
  return {
    test:true,
    "user": obj,
  };
}
else {
  return {
    test:false,
    "user": null,
  };
}
  };
  
  const getUserMe = async(req,res)=>{
    const data= await userMe(req.params.username);
    if (data.test) {
      return res.status(200).json({
        status: "success",
        data: data
      });
    } else {
      return res.status(404).json({
        response: "username is not found!",
      });
    }
      };
const userAbout=async(username)=>{
    const user = await User.findById(username);
    const obj={ 
      prefShowTrending: user.aboutReturn.prefShowTrending,
      isBlocked: user.aboutReturn.isBlocked,
      isBanned: user.member.isBanned,///et2kdee mnha???
      isMuted: user.member.isMuted,///et2kdee mnha???
      canCreateSubreddit: user.canCreateSubreddit,
      isMod: user.aboutReturn.isMuted,
      over18: user.prefs.over18,
      hasVerifiedEmail: user.hasVerifiedEmail,
      createdAt: user.createdAt,
      inboxCount: user.inboxCount,
      totalKarma: user.aboutReturn.tatolKarma,
      linkKarma: user.aboutReturn.linkKarma,
      acceptFollowers: user.aboutReturn.acceptFollowers,
      commentKarma: user.commentKarma,
      passwordSet: user.isPasswordSet,
      email: user.email,
      about: user.about,
      avatar: user.avatar,
      userID: user._id,
    };
    if (user) {
      return {
        test:true,
        "user": obj,
      };
    }
    else {
      return {
        test:false,
        "user": null,
      };
    }
    };
    const getUserAbout = async(req,res)=>{
      const data= await userAbout(req.params.username);
      if (data.test) {
        return res.status(200).json({
          status: "success",
          data: data
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
