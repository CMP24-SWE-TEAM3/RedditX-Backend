const jwt = require("jsonwebtoken");
const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const decodeJwt = require("./google-facebook-oAuth");
const randomUsername = require("../utils/random-username");

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

/**
 * Check whether google account or facebook account is in database or not (route)
 * @param {Object} req request that contain email and type.
 * @returns {String} response whether available or not.
 */
const availableGorF = async (req, res) => {
  const data = await availabeGmailOrFacebook(req.body.email, req.body.type);
  if (data.exist == false) {
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
    .then((result) => {
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
  console.log(req.body);
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
          expiresIn: 3600,
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
        expiresIn: 3600,
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
        expiresIn: 3600,
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
          expiresIn: 3600,
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
        expiresIn: 3600,
        username: data.user._id,
      });
    }
  } else {
    User.findById({ _id: req.body.username })
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            type: "bare email",
            error: "Wrong username or password.",
          });
        }
        fetchedUser = user;
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
          expiresIn: 3600,
          username: req.body.username,
        });
      })
      .catch((err) => {
        return res.status(404).json({
          type: "bare email",
          error: "Wrong username or password.",
        });
      });
  }
};

module.exports = {
  availableEmail,
  availableUser,
  availableUsername,
  signup,
  availableGorF,
  login,
};
