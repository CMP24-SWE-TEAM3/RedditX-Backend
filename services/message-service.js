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
  validateMessage = async (body) => {
    if (!body.subject || !body.text || !body.fromID || !body.toID) {
      return false;
    }
    return true;
  };

  /**
   * Creates a message
   * @param {object} body
   * @returns {object} state
   * @function
   */
  composeMessage = async (body) => {
    var message;
    try {
      message = await this.insert({
        text: body.text,
        subject: body.subject,
        fromID: body.fromID,
        toID: body.toID,
      });
    } catch {
      return {
        status: false,
        error: "operation failed",
      };
    }
    return {
      status: true,
      id: message._id.toString(),
    };
  };
  /**
   * Delete a message
   * @param {object} body
   * @returns {object} state
   * @function
   */
  deleteMessage = async (body) => {
    var message;
    const existCheck = await this.getOne({ _id: body.msgID });
    if (!existCheck) {
      return {
        status: false,
        error: "invalid msgID",
      };
    }
    try {
      message = await this.updateOne({ _id: body.msgID }, { isDeleted: true });
    } catch {
      return {
        status: false,
        error: "operation failed",
      };
    }
    return {
      status: true,
      id: message._id.toString(),
    };
  };

  /**
   * unread a message
   * @param {object} body
   * @returns {object} state
   * @function
   */
  unreadMessage = async (body) => {
    var message;
    const existCheck = await this.getOne({ _id: body.msgID });
    if (!existCheck) {
      return {
        status: false,
        error: "invalid msgID",
      };
    }
    if (existCheck.unread_status) {
      return {
        status: false,
        error: "already unread",
      };
    }
    try {
      message = await this.updateOne(
        { _id: body.msgID },
        { unread_status: true }
      );
    } catch {
      return {
        status: false,
        error: "operation failed",
      };
    }
    return {
      status: true,
      id: message._id.toString(),
    };
  };
  /**
   * Get all messages sent by user
   * @param {object} username
   * @returns {object} state
   * @function
   */
  sentMessages = async (username) => {
    var messages;

    try {
      messages = await this.find({ fromID: username, isDeleted: false });
    } catch {
      return {
        status: false,
        error: "operation failed",
      };
    }
    return {
      status: true,
      messages: messages,
    };
  };
  /**
   * Get all messages
   * @param {object} username
   * @returns {object} state
   * @function
   */
  allMessages = async (username) => {
    var messages;

    try {
      messages = await this.find({
        $or: [
          { toID: username, fromID: { $ne: username } },
          { fromID: username, toID: { $ne: username } },
        ],
      });
    } catch {
      return {
        status: false,
        error: "operation failed",
      };
    }
    return {
      status: true,
      messages: messages,
    };
  };
  /**
   * Get all messages sent by user
   * @param {object} username
   * @returns {object} state
   * @function
   */
  inboxMessages = async (username) => {
    var messages;

    try {
      messages = await this.find({ toID: username, isDeleted: false });
    } catch {
      return {
        status: false,
        error: "operation failed",
      };
    }
    return {
      status: true,
      messages: messages,
    };
  };
  /**
   * Read all messages sent by user
   * @param {object} username
   * @returns {object} state
   * @function
   */
  readAllMessages = async (username) => {
    try {
      await this.updateOne({ toID: username, unread_status: false });
    } catch {
      return {
        status: false,
        error: "operation failed",
      };
    }
    return {
      status: true,
    };
  };
}

module.exports = MessageService;
