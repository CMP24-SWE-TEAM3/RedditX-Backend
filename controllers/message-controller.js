const Message = require("../models/message-model");
const User = require("../models/user-model");
const MessageService = require("./../services/message-service");
const AuthService = require("../services/auth-service");
const IdValidator = require("../validate/listing-validators").validateObjectId;
var authServiceInstance = new AuthService(User);
var messageServiceInstance = new MessageService(Message);

/**
 * Compose message
 * @param {function} (req, res)
 * @returns {object} res
 */
const compose = async (req, res) => {
  if (!messageServiceInstance.validateMessage(req.body) || !req.username) {
    return res.status(500).json({
      response: "invalid parameters",
    });
  }
  const checkReceiver = await authServiceInstance.availableUser(req.body.toID);
  if (checkReceiver.state) {
    return res.status(500).json({
      response: "invalid receiver username",
    });
  }

  const result = await messageServiceInstance.composeMessage(req.body);
  if (result.status) {
    return res.status(200).json({
      response: "done",
      id: result.id,
    });
  } else {
    return res.status(500).json({
      response: "operation failed",
    });
  }
};

/**
 * Delete message
 * @param {function} (req, res)
 * @returns {object} res
 */
const deleteMessage = async (req, res) => {
  if (!req.username || !req.body.msgID || !IdValidator(req.body.msgID)) {
    return res.status(500).json({
      response: "invalid parameters",
    });
  }

  const result = await messageServiceInstance.deleteMessage(req.body);
  if (result.status) {
    return res.status(200).json({
      response: "done",
      id: result.id,
    });
  } else {
    return res.status(500).json({
      response: "operation failed",
      error: result.error,
    });
  }
};

/**
 * Unread message
 * @param {function} (req, res)
 * @returns {object} res
 */
const unreadMessage = async (req, res) => {
  if (!req.username || !req.body.msgID || !IdValidator(req.body.msgID)) {
    return res.status(500).json({
      response: "invalid parameters",
    });
  }

  const result = await messageServiceInstance.unreadMessage(req.body);
  if (result.status) {
    return res.status(200).json({
      response: "done",
      id: result.id,
    });
  } else {
    return res.status(500).json({
      response: "operation failed",
      error: result.error,
    });
  }
};

/**
 * Get all messages sent by user
 * @param {function} (req, res)
 * @returns {object} res
 */
const sentMessages = async (req, res) => {
  if (!req.username) {
    return res.status(500).json({
      response: "invalid parameters",
    });
  }

  const result = await messageServiceInstance.sentMessages(req.username);
  if (result.status) {
    return res.status(200).json({
      response: "done",
      messages: result.messages,
    });
  } else {
    return res.status(500).json({
      response: "operation failed",
      error: result.error,
    });
  }
};

/**
 * Get user inbox messages
 * @param {function} (req, res)
 * @returns {object} res
 */
const inboxMessages = async (req, res) => {
  if (!req.username) {
    return res.status(500).json({
      response: "invalid parameters",
    });
  }

  const result = await messageServiceInstance.inboxMessages(req.username);
  if (result.status) {
    return res.status(200).json({
      response: "done",
      messages: result.messages,
    });
  } else {
    return res.status(500).json({
      response: "operation failed",
      error: result.error,
    });
  }
};
/**
 * Get all messages
 * @param {function} (req, res)
 * @returns {object} res
 */
const allMessages = async (req, res) => {
  if (!req.username) {
    return res.status(500).json({
      response: "invalid parameters",
    });
  }

  const result = await messageServiceInstance.allMessages(req.username);
  if (result.status) {
    return res.status(200).json({
      response: "done",
      messages: result.messages,
    });
  } else {
    return res.status(500).json({
      response: "operation failed",
      error: result.error,
    });
  }
};
/**
 * Read all messages
 * @param {function} (req, res)
 * @returns {object} res
 */
const readAllMessages = async (req, res) => {
  if (!req.username) {
    return res.status(500).json({
      response: "invalid parameters",
    });
  }

  const result = await messageServiceInstance.allMessages(req.username);
  if (result.status) {
    return res.status(200).json({
      response: "done",
    });
  } else {
    return res.status(500).json({
      response: "operation failed",
      error: result.error,
    });
  }
};
module.exports = {
  compose,
  deleteMessage,
  sentMessages,
  inboxMessages,
  unreadMessage,
  allMessages,
  readAllMessages,
};
