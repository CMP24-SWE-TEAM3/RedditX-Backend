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
      "user": user.prefs
    }
  }
};
const getUserPrefs = catchAsync(async(req,res,next)=>{
  if(!req.params.username)return next(new AppError("username is not found!", 500));
  const data= await userPrefs(req.params.username);
   res.status(200).json({
    status: "success",
    data: data.user
  });
  next();
});
const userAbout=async(username)=>{
  const user = await User.findById(username);
    if (user) {
      return {
        "user": user.aboutReturn
      }
    }
  };
  const getUserAbout = catchAsync(async(req,res,next)=>{
    if(!req.params.username)return next(new AppError("username is not found!", 500));
    const data= await userAbout(req.params.username);
    res.status(200).json({
      status: "success",
      data: data
    });
    next();
  }); 
const userMe=async(username)=>{
    const user = await User.findById(username);
      if (user) {
        return {
          "user": user.meReturn
        }
      }
    };
const getUserMe = catchAsync(async(req,res,next)=>{
  if(!req.params.username)return next(new AppError("username is not found!", 500));
  const data= await userMe(req.params.username);
    res.status(200).json({
      status: "success",
      data: data.user
    });
    next();
    });
    module.exports = {
      getUserMe,
      getUserAbout,
      getUserPrefs
    };
