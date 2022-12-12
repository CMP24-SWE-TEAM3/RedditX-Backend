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
    const message= await this.insert({"text":body.text,"subject":body.subject,"fromID":body.fromID})
    console.log(message);
    return {
        status:true,
        id:message._id.toString()
    }
    }
}

module.exports = MessageService;
