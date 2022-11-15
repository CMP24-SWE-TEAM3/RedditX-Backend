const jwt = require("jsonwebtoken");
const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const decodeJwt = require("./google-facebook-oAuth");
const randomUsername = require("../utils/random-username");
const Email = require("./../utils/email");
const AppError = require("../utils/app-error");
const catchAsync = require("../utils/catch-async");

/**
 * Check whether user name is in database or not (function)
 * @param {Object} username username of the user.
 * @returns {String} state of the operation whether false or true to indicate the sucess.
 * @returns {Object} user return from the database.
 */
const availableUser = async (username) => {
  const user = await User.findById(username);
  if (user) {
    return {
      state: false,
      user: user,
    };
  } else {
    return {
      state: true,
      user: null,
    };
  }
};

/**
 * Check whether email is in database or not (function)
 * @param {String} email  state of the operation whether false or true to indicate the sucess.
 * @returns {Boolean} exist whether the email exists or not.
 
*/
const availableEmail = async (email) => {
  const user = await User.findOne({ email: email });
  if (user) {
    return {
      exist: true,
    };
  } else {
    return {
      exist: false,
    };
  }
};
/**
 * Check whether google account or facebook account is in database or not (function)
 * @param {String} email the email that will be searched by in the database.
 * @param {String} type the type of the email that will be searched by in the database.
 * @returns {Object} user the returned user from the database.
 * @returns {Boolean} exist whether the email exists or not.
 */
const availabeGmailOrFacebook = async (email, type) => {
  const user = await User.findOne({ email: email, type: type });
  if (user) {
    return {
      exist: true,
      user: user,
    };
  } else {
    return {
      exist: false,
      user: null,
    };
  }
};

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
 * Change password according to type of email
 * @param {param} type type of the email.
 * @param {param} password password of the email.
 * @returns {String} (type whether '1' or the password parameter).
 */
const changePasswordAccType = (type, password) => {
  return type == "facebook" || type == "gmail" ? "1" : password;
};
/**
 * Signing the token
 * @param {String} emailType email type.
 * @param {String} username username of the user.
 * @returns {String} (signed token)
 */
const signToken = (emailType, username) => {
  return jwt.sign(
    { emailType: emailType, username: username },
    "mozaisSoHotButNabilisTheHottest",
    { expiresIn: "120h" }
  );
};

/**
 * Check whether username is in database or not (route)
 * @param {Object} req request that contains the username.
 * @param {Object} res
 * @returns {object} response whether available or not.
 */
const availableUsername = async (req, res) => {
  const data = await availableUser(req.query.username);
  if (data.state) {
    return res.status(200).json({
      response: "Avaliable",
    });
  } else {
    return res.status(404).json({
      response: "Not Avaliable",
    });
  }
};

/**
 * Save user in database
 * @param {String} email email of the user
 * @param {String} hash hashed password
 * @param {String} username username of the user
 * @param {String} type type of the email
 * @returns {object} (status,username)
 */
const createUser = async (email, hash, username, type) => {
  const user = new User({
    email: email,
    password: hash,
    _id: username,
    type: type,
    isPasswordSet: type == "gmail" || type == "facebook" ? false : true,
  });
  const result = user
    .save()
    .then(() => {
      return {
        username: user._id,
        status: "done",
      };
    })
    .catch((err) => {
      return {
        username: null,
        status: "error",
        error: err,
      };
    });
  return result;
};

/**
 * Signup (route)
 * @param {Object} (req, res)
 * @returns {object} {token,expiresIn,username} or {error}
 */
const signup = async (req, res) => {
  const pass = changePasswordAccType(req.body.type, req.body.password);
  const hash = await bcrypt.hash(pass, 10);
  if (req.body.type == "gmail" || req.body.type == "facebook") {
    const decodeReturn = decodeJwt.decodeJwt(req.body.googleOrFacebookToken);
    if (decodeReturn.error != null) {
      return res.status(400).json({
        error: "invalid token",
      });
    }
    const email = decodeReturn.payload.email;
    const data = await availabeGmailOrFacebook(email, req.body.type);
    //case if not available in database random new username and send it
    if (data.exist == false) {
      const username = randomUsername.randomUserName();
      const result = await createUser(email, hash, username, req.body.type);
      if (result.username != null) {
        const token = signToken(req.body.type, username);
        return res.status(200).json({
          token: token, //token,
          expiresIn: 3600 * 24,
          username: username,
        });
      } else {
        return res.status(400).json({
          error: "error happened",
        });
      }
    } else {
      const token = signToken(req.body.type, data.user_id);
      return res.status(200).json({
        token: token, //token,
        expiresIn: 3600 * 24,
        username: data.user._id,
      });
    }
  } else {
    //signup with bare email
    const data = await availableEmail(req.body.email);
    if (data.exist)
      return res.status(400).json({
        error: "Duplicate email!",
      });
    const result = await createUser(
      req.body.email,
      hash,
      req.body.username,
      req.body.type
    );
    if (result.username != null) {
      const token = await signToken(req.body.type, req.body.username);

      return res.status(200).json({
        token: token, //token,
        expiresIn: 3600 * 24,
        username: req.body.username,
      });
    } else {
      return res.status(400).json({
        error: "duplicate username",
      });
    }
  }
};

/**
 * Login (route)
 * @param {Object} req req must contain the correct data.
 * @param {Object} res
 * @returns {object} {token,expiresIn,username} or {error}
 */

const login = async (req, res) => {
  const pass = changePasswordAccType(req.body.type, req.body.password);
  const hash = await bcrypt.hash(pass, 10);
  if (req.body.type == "gmail" || req.body.type == "facebook") {
    const decodeReturn = decodeJwt.decodeJwt(req.body.googleOrFacebookToken);
    if (decodeReturn.error != null) {
      return res.status(404).json({
        error: "invalid token",
      });
    }
    const email = decodeReturn.payload.email;
    const data = await availabeGmailOrFacebook(email, req.body.type);
    //case if not available in database random new username and send it
    if (data.exist == false) {
      const username = randomUsername.randomUserName();
      const result = await createUser(email, hash, username, req.body.type);
      if (result.username != null) {
        const token = signToken(req.body.type, username);
        return res.status(200).json({
          token: token, //token,
          expiresIn: 3600 * 24,
          username: username,
        });
      } else {
        return res.status(404).json({
          error: "error happened",
        });
      }
    } else {
      const token = signToken(req.body.type, data.user_id);
      return res.status(200).json({
        token: token, //token,
        expiresIn: 3600 * 24,
        username: data.user._id,
      });
    }
  } else {
    User.findById(req.body.username)
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            type: "bare email",
            error: "Wrong username or password.",
          });
        }
        return bcrypt.compareSync(req.body.password, user.password);
      })
      .then(async (result) => {
        if (!result) {
          return res.status(404).json({
            type: "bare email",
            error: "Wrong username or password.",
          });
        }
        const token = await signToken(req.body.type, req.body.username);
        return res.status(200).json({
          token: token,
          expiresIn: 3600 * 24,
          username: req.body.username,
        });
      })
      .catch(() => {
        return res.status(404).json({
          type: "bare email",
          error: "Wrong username or password.",
        });
      });
  }
};

const forgotPassword = catchAsync(async (req, res, next) => {
  if (req.body.operation) {
    // in case of forgot username
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(
        new AppError("There is no user with this email address!", 404)
      );
    }
    try {
      await new Email(user, "none").sendUsername();
      return res.status(200).json({
        status: "success",
        message: "Username is sent to the email!",
      });
    } catch (err) {
      return next(new AppError("There was an error in sending the mail!", 500));
    }
  }
  const user = await User.findById(req.body.username);
  if (!user) {
    return next(new AppError("There is no user with this username!", 404));
  }
  // Generate the random reset token
  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false }); // in order to save the passwordResetToken and passwordResetExpires
  // 3) Send the reset token to the user email
  try {
    const reqURL = `http://dev.redditswe22.tech/user/reset-password/${resetToken}`;
    await new Email(user, reqURL).sendPasswordReset();
    res.status(200).json({
      status: "success",
      message: "Link is sent to the email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError("There was an error in sending the mail!", 500));
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  // Get user with token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passswordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // If token is not expired and there is a user, set the new password
  if (!user) return next(new AppError("Link is invalid or expired!", 400));
  if (req.body.confirmedNewPassword !== req.body.newPassword)
    return next(
      new AppError("Password is not equal to confirmed password!", 400)
    );
  const hash = await bcrypt.hash(req.body.newPassword, 10);
  user.password = hash;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  console.log(user);
  await user.save();
  // Log the user in: send JWT
  const token = await signToken("bare email", user._id);
  return res.status(200).json({
    token: token,
    expiresIn: 3600 * 24,
    username: user._id,
  });
});

module.exports = {
  availableEmail,
  availableUser,
  availableUsername,
  signup,
  login,
  forgotPassword,
  resetPassword,
};
