const Message = require("../models/message-model");
const User=require("../models/user-model");
const MessageService = require("./../services/message-service");
const AuthService=require("../services/auth-service");
var authServiceInstance= new AuthService(User);
var messageServiceInstance = new MessageService(Message);



/**
 * Compose message
 * @param {function} (req, res)
 * @returns {object} res
 */
const compose=async(req,res,next)=>{
    console.log(req.username);
    console.log(req.body);
    if(!messageServiceInstance.validateMessage(req.body)||!req.username){
        return res.status(500).json({
            response:"invalid parameters"
          });
    }
    const checkReceiver= await authServiceInstance.availableUser(req.body.toID);
    if(checkReceiver.state){
        return res.status(500).json({
            response:"invalid receiver username"
          });
    }

    const result=await messageServiceInstance.composeMessage(req.body);
    console.log(result);
    if(result.status){
      return res.status(200).json({
        response:"done",
        id:result.id
      });
    }
    else{
      return res.status(500).json({
        response:"operation failed"
      });
    }
   
  }
  


module.exports = {
    compose
  };
  