const User = require("../models/user-model");

const AuthService = require("./../services/auth-service");

var authServiceInstance = new AuthService(User);

const catchAsync = require("../utils/catch-async");
const UserService = require("./../services/user-service");

const userServiceInstance = new UserService(User);

// /**
//  * Check whether google account or facebook account is in database or not (route)
//  * @param {Object} req request that contain email and type.
//  * @returns {String} response whether available or not.
//  */
// const availableGorF = async (req, res) => {
//   const data = await availabeGmailOrFacebook(req.body.email, req.body.type);
//   if (data.exist == false) {
//     return res.status(200).json({
//       response: "Avaliable",
//     });
//   } else {
//     return res.status(404).json({
//       response: "Not Avaliable",
//     });
//   }
// };

/**
 * Check whether username is in database or not (route)
 * @param {Object} req request that contains the username.
 * @param {Object} res
 * @returns {object} response whether available or not.
 */
const availableUsername = async (req, res) => {
  const data = await authServiceInstance.availableUser(req.query.username);
  if (data.state) {
    return res.status(200).json({ response: "Available" });
  } else {
    return res.status(404).json({ response: "Not Available" });
  }
};

/**
 * Signup (route)
 * @param {Object} (req, res)
 * @returns {object} {token,expiresIn,username} or {error}
 */
const signup = async (req, res) => {
  const result = await authServiceInstance.signup(req.body);
  if (result.state) {
    return res.status(200).json({
      token: result.token, //token,
      expiresIn: result.expiresIn,
      username: result.username,
    });
  } else {
    return res.status(404).json({
      error: result.error,
    });
  }
};
/**
 * Login (route)
 * @param {Object} req req must contain the correct data.
 * @param {Object} res
 * @returns {object} {token,expiresIn,username} or {error}
 */

const login = async (req, res) => {
  const result = await authServiceInstance.login(req.body);
  if (result.state) {
    return res.status(200).json({
      token: result.token, //token,
      expiresIn: result.expiresIn,
      username: result.username,
    });
  } else {
    return res.status(404).json({
      error: result.error,
    });
  }
};

const forgotPassword = catchAsync(async (req, res, next) => {
  if (req.body.operation) {
    // in case of forgot username
    try {
      await userServiceInstance.forgotUsername(req.body.email);
    } catch (err) {
      return next(err);
    }
    return res.status(200).json({
      status: "success",
      message: "Username is sent to the email!",
    });
  }
  try {
    await userServiceInstance.forgotPassword(req.body.username);
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    message: "Link is sent to the email!",
  });
});

const resetForgottenPassword = catchAsync(async (req, res, next) => {
  var data = undefined;
  try {
    data = await userServiceInstance.resetForgottenPassword(
      req.params.token,
      req.body.newPassword,
      req.body.confirmedNewPassword
    );
  } catch (err) {
    return next(err);
  }
  return res.status(200).json({
    token: data.token,
    expiresIn: 3600 * 24,
    username: data.id,
  });
});
const resetUserPassword = catchAsync(async (req, res, next) => {
  try {
    await authServiceInstance.resetPassword(
      req.username,
      req.body.currentPassword,
      req.body.newPassword,
      req.body.confirmNewPassword
    );
  } catch (err) {
    return next(err);
  }
  return res.status(200).json({
    status: "success",
    message: "Password is reset",
  });
});

module.exports = {
  availableUsername,
  signup,
  login,
  forgotPassword,
  resetForgottenPassword,
  resetUserPassword,
};
