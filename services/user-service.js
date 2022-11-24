/**
 * FILE: user-service
 * description: the services related to users only
 * created at: 15/11/2022
 * created by: Mohamed Nabil
 * authors: Ahmed Lotfy, Shredan Abdullah, Moaz Mohamed, Mohamed Nabil
 */
const Service = require("./service");
const AppError = require("./../utils/app-error");
const Email = require("./../utils/email");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User=require("../models/user-model");
const Community=require("../models/community-model");

const AuthService = require('./../services/auth-service');

var authServiceInstance = new AuthService(User);
const CommunityService = require('./../services/community-service');

var communityServiceInstance = new CommunityService(Community);

/**
 * @namespace UserService
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
   */
  signToken = (emailType, username) => {
    return jwt.sign(
      { emailType: emailType, username: username },
      "mozaisSoHotButNabilisTheHottest",
      { expiresIn: "120h" }
    );
  };
  

/**
   * Subscribe to a subreddit or redditor
   * @param {String} body body contains the information.
   * @returns {Boolean} (state)
   */
  subscribe=async(body,username)=>{
    const id=body.srName.substring(0,2);
    const action=body.action;
    
    if(id==="t2"){
      console.log("d");
      //check the username
      const result=await authServiceInstance.availableUser(body.srName);
      console.log(result);
      if(result.state){
        return {
          state:false,
          error:"invalid username"
        }
      }
      else{
        var isFound=false;
        var followerArr=result.user.followers;
        for(var i=0;i<followerArr.length;i++){
          if(followerArr[i]===username) {
            isFound=true;
            break;
          }
        }
        
        try{
        if(action==='sub'){
          if(isFound){
            return {
              state:false,
              error:"already followed"
            }
          }
         await this.updateOne(
            {_id:username},
            {$addToSet:{"follows":body.srName}});
         await   this.updateOne(
            {_id:body.srName},
            {$addToSet:{"followers":username}});
        }
        else{
          if(!isFound){
            return {
              state:false,
              error:"operation failed the user is already not followed"
            }
          }
          await this.updateOne(           
             {_id:username}, 
            {$pull: { "follows":body.srName}});
            await this.updateOne(   

               {_id:body.srName}, 
              {$pull: { "followers":username}});
        }
      }
      catch{
        return {
          state:false,
          error:"error"
        }
      }
      return {
        state:true
        ,error:null
      }

      }

    }
    else if(id==='t5'){
      const result=await communityServiceInstance.availableSubreddit(body.srName);
      if(result.state){
        return {
          state:false,
          error:"invalid subreddit"
        }
      }
      else{
        const user=await authServiceInstance.availableUser(username);
        if(user.state){
          return {
            state:false,
            error:"invalid username"
          }
        }
        var isFound=false;
        var memberArr=user.user.member;
        for(var i=0;i<memberArr.length;i++){
          if(memberArr[i].communityId===body.srName) {
            isFound=true;
            break;
          }
        }
        try{
          if(action==='sub'){
            if(isFound){
              return {
                state:false,
                error:"already followed"
              }
            }
           await this.updateOne(
              {_id:username},
              {$addToSet:{"member":{communityId:body.srName,isBanned:false,isMuted:false}}});
           await   communityServiceInstance.updateOne(
              {_id:body.srName},
              {$addToSet:{"members":{userID:username,isBanned:false,isMuted:false}}});
          }
          else{
            if(!isFound){
              return {
                state:false,
                error:"operation failed the user is already not followed"
              }
            }
            await this.updateOne(           
               {_id:username}, 
              {$pull: { "member":{communityId:body.srName}}});
              await communityServiceInstance.updateOne(   
  
                 {_id:body.srName}, 
                {$pull: {"members":{userID:username}}});
          }
        }
        catch(err){
          console.log(err);
          return {
            state:false,
            error:"error"
          }
        }
        return {
          state:true
          ,error:null
        }

      }
    }

  }
  getFilteredSubreddits = (subreddits) => {
    return subreddits.map((el) => {
      if (!el.isBanned) {
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
    let users = await this.getAll(
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
      select: '-_id follows'
    });
    users = users.map((el) => {
      el.follow = follows.indexOf(el._id) != -1;
      delete el.prefs;
      console.log(el)
      return el;
    });
    return users;
  };

  /**
   * Saves filename to database
   * @param {object} data
   * @param {string} username
   * @param {object} file
   */
  uploadUserPhoto = async (action, username, file) => {
    if (!action)
      throw new AppError("No attachment or action is provided!", 400);
    let avatar = "default.jpg";
    if (action === "upload") {
      if (!file) throw new AppError("No photo is uploaded!", 400);
      avatar = file.filename;
    }
    await this.findByIdAndUpdate(username, { avatar }, { runValidators: true });
  };

  /**
   * Blocks another user
   * @param {string} from
   * @param {string} to
   * @param {boolean} action
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
   * Resets user password and returns a new token
   * @param {string} token
   * @param {string} newPassword
   * @param {string} confirmedNewPassword
   * @returns {object} object
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
}

module.exports = UserService;
