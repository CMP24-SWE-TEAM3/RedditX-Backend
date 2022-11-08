const AppError = require("../utils/app-error");
const catchAsync = require("../utils/catch-async");
const Post = require("./../models/post-model");
const User = require('./../models/user-model');
const makeRandomString = require("./../utils/randomString");
const multer = require("multer");
const APIFeatures = require("../utils/api-features");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/posts/files");
  },
  filename: async (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      return cb(null, `post-file-${makeRandomString()}-${Date.now()}.jpg`);
    }
    cb(
      null,
      `post-file-${makeRandomString()}-${Date.now()}-${file.originalname}`
    );
  },
});

const upload = multer({
  storage: multerStorage,
});

exports.uploadPostFiles = upload.array("attachments", 10);

exports.submit = catchAsync(async (req, res, next) => {
  req.body.attachments = [];
  if (req.files) {
    req.files.forEach((file) => req.body.attachments.push(file.filename));
  }
  req.body.createdAt = req.requestTime;
  req.body.communityID = req.body.communityID.slice(3);
  // req.body.userID = req.user.userID;   ////////////// CHANGE TO THIS AFTER PROTECT IS FINISHED ////////////
  req.body.voters = [{ userID: req.body.userID, voteType: 1 }]; /////////// CHANGE TO req.user.userID AFTER PROTECT IS FINISHED ////////////
  const newPost = await Post.create(req.body);
  res.status(201).json(newPost);
});

exports.save = catchAsync(async (req, res, next) => {
  // req.user.saves.push({ postID: req.body.linkID.slice(3), category: req.body.category });
  // await User.updateOne({ userID: req.user.userID }, req.user);
  res.status(200).json({
    status: "success",
    message: "Post is saved successfully",
  });
});

exports.unsave = catchAsync(async (req, res, next) => {
  // req.user.saves.splice(req.user.saves.findIndex(el => el.postID === req.body.linkID.slice(3)), 1);
  // await User.updateOne({ userID: req.user.userID }, req.user);
  res.status(200).json({
    status: "success",
    message: "Post is unsaved successfully",
  });
});


exports.addSubreddit = (req, res, next) => {
  if (req.params.subreddit) req.addedFilter = { communityID: `t5_${req.params.subreddit}` };
  next();
}


exports.getPosts = catchAsync(async (req, res, next) => {
  /*first of all : check if the request has certain subreddit or not*/
  if (!req.addedFilter) {
    /* here the request dosn't contain certain subreddit then we will get the posts from friends and subreddits*/


    /* if user signed in we will do the following
    1.get the categories of the user
    2. get the friends of the user
    3. get the posts based on these categories and the users*/
    if (req.username) {
      /*step 1,2 :get the categories and friends of the user*/
      const { member, friend } = (await (User.findById(req.username).select('-_id member friend')));
      const subreddits = member.map((el) => {
        if (!el.isMuted) {
          return el.communityId;
        }
      })
      /* step 3 :add the subreddits to addedFilter*/
      req.addedFilter = {
        $or:
          [
            {
              communityID: {
                $in: subreddits
              }
            },
            {
              userID: {
                $in: friend
              }
            }
          ]
      }
    }
  }
  let sort = {};
  if (req.params.criteria) {
    if (req.params.criteria === 'best')
      sort = {
        bestFactor: 1,
      };
    else if (req.params.criteria === 'hot')
      sort = {
        hotnessFactor: 1,
      };
    else if (req.params.criteria === 'new') {
      sort = {
        createdAt: 1
      };
    }
    else if (req.params.criteria === 'top')
      sort = {
        votesCount: 1,
      };
  }
  const features = new APIFeatures(Post.find(req.addedFilter, null, { sort }), req.query)
    .filter()
    .paginate()
    .sort()
    .selectFields();

  const posts = await features.query;
  res.status(200).json({
    status: 'succeeded',
    posts
  })
})