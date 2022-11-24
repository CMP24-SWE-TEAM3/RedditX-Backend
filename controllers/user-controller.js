const AppError = require("../utils/app-error");
const catchAsync = require("../utils/catch-async");
const User = require("./../models/user-model");
const Post = require("./../models/post-model");
const Comment = require("./../models/comment-model");
const Community = require("./../models/community-model");
const sharp = require("sharp");
const availableUser=require("./auth-controller").availableUser;

/**
 * Name, resize, and save the uploaded file
 * @param {function} (req, res, next)
 */

const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.username}-${Date.now()}.jpg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpg")
    .toFile(`public/users/files/${req.file.filename}`);
  next();
});

/**
 * Saves filename to database
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const uploadUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.body.action)
    return next(new AppError("No attachment or action is provided!", 400));
  let avatar = "default.jpg";
  if (req.body.action === "upload") {
    if (!req.file) return next(new AppError("No photo is uploaded!", 400));
    avatar = req.file.filename;
  }
  await User.findByIdAndUpdate(
    req.username,
    { avatar },
    { runValidators: true }
  );
  res.status(200).json({
    status: "success",
    message: "Avatar is updated successfully",
  });
});

/**
 * Blocks another user
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const block = catchAsync(async (req, res, next) => {
  if (!req.body.userID)
    return next(new AppError("No linkID is provided!", 400));
  const toUser = await User.findById(req.body.userID);
  const myUser = await User.findById(req.username);
  if (!toUser || !myUser)
    return next(new AppError("This user doesn't exist!", 404));
  if (req.body.action === true) {
    // block
    if (toUser.blocksToMe.find((el) => el === req.username))
      return res.status(200).json({
        status: "success",
        message: "Blocks are updated successfully",
      });
    myUser.blocksFromMe.push(req.body.userID);
    toUser.blocksToMe.push(req.username);
  } else {
    // unblock
    myUser.blocksFromMe.splice(
      myUser.blocksFromMe.findIndex((el) => el === req.body.userID),
      1
    );
    toUser.blocksToMe.splice(
      toUser.blocksToMe.findIndex((el) => el === req.username),
      1
    );
  }
  await myUser.save();
  await toUser.save();
  res.status(200).json({
    status: "success",
    message: "Blocks are updated successfully",
  });
});

/**
 * Spams a post or a comment
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const spam = catchAsync(async (req, res, next) => {
  if (!req.body.linkID)
    return next(new AppError("No linkID is provided!", 400));
  if (req.body.linkID[1] === "3") {
    // Spam a post
    const post = await Post.findById(req.body.linkID.slice(3));
    if (!post) return next(new AppError("This post doesn't exist!", 404));
    if (post.spammers.find((el) => el.spammerID === req.username))
      return res.status(200).json({
        status: "success",
        message: "Spams are updated successfully",
      });
    post.spammers.push({
      spammerID: req.username,
      spamType: req.body.spamType,
      spamText: req.body.spamText,
    });
    post.spamCount++;
    if (post.communityID !== undefined && post.communityID !== "") {
      const community = await Community.findById(post.communityID).select(
        "communityOptions"
      );
      if (
        community &&
        post.spamCount >= community.communityOptions.spamsNumBeforeRemove
      )
        post.isDeleted = true;
    }
    await post.save();
  } else {
    // Spam a comment
    const comment = await Comment.findById(req.body.linkID.slice(3));
    if (!comment) return next(new AppError("This comment doesn't exist!", 404));
    if (comment.spams.find((el) => el.userID === req.username))
      return res.status(200).json({
        status: "success",
        message: "Spams are updated successfully",
      });
    comment.spams.push({
      userID: req.username,
      type: req.body.spamType,
      text: req.body.spamText,
    });
    comment.spamCount++;
    const post = await Post.findById(comment.replyingTo).select("communityID");
    if (post.communityID !== undefined && post.communityID !== "") {
      const community = await Community.findById(post.communityID).select(
        "communityOptions"
      );
      if (
        community &&
        comment.spamCount >= community.communityOptions.spamsNumBeforeRemove
      )
        comment.isDeleted = true;
    }
    await comment.save();
  }
  res.status(200).json({
    status: "success",
    message: "Spams are updated successfully",
  });
});

/**
 * Get user prefs from database
 * @param {String} (username)
 * @returns {object} user
 */
const userPrefs = async (username) => {
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
 * Get user prefs
 * @param {function} (req,res)
 * @returns {object} res
 */
const getUserPrefs = async (req, res) => {
  const data = await userPrefs(req.username);
  if (data.test) {
    return res.status(200).json({
      data: data.user,
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
const userMe = async (username) => {
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
      test: true,
      user: obj,
    };
  } else {
    return {
      test: false,
      user: null,
    };
  }
};
/**
 * Get user me info
 * @param {function} (req,,res)
 * @returns {object} res
 */
const getUserMe = async (req, res) => {
  const data = await userMe(req.username);
  if (data.test) {
    return res.status(200).json({
      data: data.user,
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
const userAbout = async (username) => {
  const user = await User.findById(username);
  if (user) {
    const obj = {
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
      test: true,
      user: obj,
    };
  } else {
    return {
      test: false,
      user: null,
    };
  }
};
/**
 * Get user about
 * @param {function} (req,res)
 * @returns {object} res
 */
const getUserAbout = async (req, res) => {
  const data = await userAbout(req.params.username);
  if (data.test) {
    return res.status(200).json({
      data: data.user,
    });
  } else {
    return res.status(404).json({
      response: "username is not found!",
    });
  }
};

const returnResponse=(obj,statusCode)=>{
  return res.status(statusCode).json(
    obj
  );
}



const availableSubreddit=async(subreddit)=>{

  const subre = await Community.findById(subreddit);
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
/**
 * Subscribe to a subreddit or a redditor
 * @param {function} (req,res)
 * @returns {object} res
 */
const subscribe = async (req, res) => {
    if(!req.body.srName||!req.body.action){
      return returnResponse({error:"invalid inputs"},400);
    }

    const id=req.body.srName.substring(0,2);
    const action=req.body.action;
    if(id==='t2'){
      //check the username
      const result=availableUser(req.body.srName);
      if(!result.state){
        return returnResponse({error:"invalid username"},404);
      }
      else{
        
        if(action==='sub'){
          User.updateMany(
            {_id:req.username},
            {$addToSet:{"follows":req.body.srName}});
          User.updateMany(
            {_id:req.body.srName},
            {$addToSet:{"followers":req.username}});
        }
        else{
          User.updateMany( 
            {_id:req.username}, 
            {$pull: { "follows":req.body.srName}});
          User.updateMany( 
              {_id:req.body.srName}, 
              {$pull: { "followers":req.username}});
        }

      }

    }
    else if(id==='t5'){
      const result=availableSubreddit(req.body.srName);
      if(!result.state){
        return returnResponse({error:"invalid subreddit"},404);
      }
      else{
        

      }
    }

};


module.exports = {
  resizeUserPhoto,
  uploadUserPhoto,
  block,
  spam,
  returnResponse,
  getUserMe,
  getUserAbout,
  getUserPrefs,
};
