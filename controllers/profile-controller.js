const AppError = require("../utils/app-error");
const catchAsync = require("../utils/catch-async");
const User = require('./../models/user-model');
const Comment = require('./../models/comment-model');
const Post = require('./../models/post-model');
//const factory = require("./handler-factory");
const makeRandomString = require("../utils/randomString");
const sharp = require("sharp");
     
function mergeTwo(A, B)
{
    let m = A.length;
    let n = B.length;
    let D = [];
 
    let i = 0, j = 0;
    while (i < m && j < n) {
 
        if (A[i].createdAt <= B[j].createdAt)
            D.push(A[i++]);
        else
            D.push(B[j++]);
    }
    while (i < m)
        D.push(A[i++]);
    while (j < n)
        D.push(B[j++]);
 
    return D;
}
const userOverview=async(username)=>{
  //if(!username)return next(new AppError("username is not found!", 500));
  const overview = await User.findById(username);
  if (overview) {
  
  const posts= await Post.find( { _id : { $in : overview.hasPost } } );
  const comments= await Comment.find( { _id : { $in : overview.hasComment } } );
  const replies= await Comment.find( { _id : { $in : overview.hasReply } } );

    let merged = mergeTwo(posts, comments);
    let overviewReturn=[];
    overviewReturn= mergeTwo(merged, replies);
    return {
      test:true,
      userOverview: overviewReturn.reverse(),
    };
  //return overviewReturn.reverse();
  }
  else {
    return {
      test:false,
      userOverview: null,
    };
  }
};
const getUserOverview = async(req,res)=>{
  console.log(req.params.username);
  //if(!req.params.username)return next(new AppError("username is not found!", 500));
  const data= await userOverview(req.params.username);
  console.log(data);
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
   //res.status(200).json({
    ///status: "success",
    //data: data
  //});
  //next();
};
const userSubmitted=async(username)=>{
  const user = await User.findById(username);
  if (user) {
  
  const posts= await Post.find( { _id : { $in : user.hasPost } } );
  return posts;
  }
  };

const getUserSubmitted = catchAsync(async(req,res,next)=>{
  if(!req.params.username)return next(new AppError("username is not found!", 500));
  const data= await userSubmitted(req.params.username);
   res.status(200).json({
    status: "success",
    data: data
  });
  //next();
}); 

  const userComments=async(username)=>{
    const user = await User.findById(username);
    if (user) {
    
    const posts= await Post.find( { _id : { $in : user.hasComment } } );
    return posts;
    }
    };
    const getUserComments = catchAsync(async(req,res,next)=>{
      if(!req.params.username)return next(new AppError("username is not found!", 500));
      const data= await userComments(req.params.username);
      res.status(200).json({
        status: "success",
        data: data
      });
      //next();
    }); 
  const userDownVoted=async(username)=>{
    const dVote = await User.findById(username).select('hasVote'); 
    const votes= dVote.hasVote;
    //console.log(dVote);
    let postIDs=[];
    votes.forEach((el)=>{
        if(el.type===-1){
            postIDs.push(el.postID);
        }
    });
    
    const posts= await Post.find( { _id : { $in : postIDs } } );

   return posts;
   };
const getUserDownVoted = catchAsync(async(req,res,next)=>{
  if(!req.params.username)return next(new AppError("username is not found!", 500));
  const data= await userDownVoted(req.params.username);
    res.status(200).json({
      status: "success",
      data: data
    });
    //next();
    });

const userUpVoted=async(username)=>{
    const uVote = await User.findById(username).select('hasVote'); 
    const votes= uVote.hasVote;
    //console.log(dVote);
    let postIDs=[];
    votes.forEach((el)=>{
        if(el.type===1){
            postIDs.push(el.postID);
        }
    });
    
    const posts= await Post.find( { _id : { $in : postIDs } } );

    return posts;
  };
    
const getUserUpVoted = catchAsync(async(req,res,next)=>{
  if(!req.params.username)return next(new AppError("username is not found!", 500));
  const data= await userUpVoted(req.params.username);
    res.status(200).json({
      status: "success",
      data: data
    });
    //next();
    });
    module.exports = {
        getUserDownVoted,
        getUserOverview,
        getUserUpVoted,
        getUserSubmitted,
        getUserComments
    };
