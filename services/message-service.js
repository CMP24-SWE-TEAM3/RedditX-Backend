const Service = require("./service");

/**
 * Service class to handle Authentication manipulations.
 * @class MessageService
 */
class MessageService extends Service {
  constructor(model) {
    super(model);
  }

  /**
   * Validate message from user
   * @param {object} body
   * @returns {object} boolean
   * @function
   */
  validateMessage=async(body)=>{
    if(!body.subject||!body.text||!body.fromID||!body.toID){
        return false;
    }
    return true;
  }

  /**
   * Creates a message
   * @param {object} body
   * @returns {object} state
   * @function
   */
   composeMessage=async(body)=>{
    var message;
    try{
     message= await this.insert({"text":body.text,"subject":body.subject,"fromID":body.fromID})
    }
    catch{
      return {
        status:false,
        error:"operation failed"
      }
    }
    console.log(message);
    return {
        status:true,
        id:message._id.toString()
    }
    }
     /**
   * Delete a message
   * @param {object} body
   * @returns {object} state
   * @function
   */
   deleteMessage=async(body)=>{
    var message;
    const existCheck=await this.getOne({_id:body.msgID});
    if(!existCheck){
      return {
        status:false,
        error:"invalid msgID"
      }
    }
    try{
     message= await this.updateOne({_id:body.msgID},{isDeleted:true})
    }
    catch{
      return {
        status:false,
        error:"operation failed"
      }
    }
    console.log(message);
    return {
        status:true,
        id:message._id.toString()
    }
    }
}

module.exports = MessageService;
