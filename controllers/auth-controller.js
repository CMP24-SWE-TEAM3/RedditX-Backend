const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const decodeJwt = require("./google-facebook-oAuth");
const randomUsername = require("../utils/random-username");
const AuthService = require('./../services/auth-service');

var authServiceInstance = new AuthService(User);



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
    return res.status(200).json({response: "Available"});
  } else {
    return res.status(404).json({response: "Not Available"});
  }
};


/**
 * Signup (route)
 * @param {Object} (req, res)
 * @returns {object} {token,expiresIn,username} or {error}
 */
const signup = async (req, res) => {
   const result=await authServiceInstance.signup(req.body);
   console.log(result);
   if(result.state){
    return res.status(200).json({
    
      token: result.token, //token,
      expiresIn: result.expiresIn,
      username: result.username,
    })
   }
   else{
    return res.status(404).json({
      error:result.error
    })
   }
};

/**
 * Login (route)
 * @param {Object} req req must contain the correct data.
 * @param {Object} res
 * @returns {object} {token,expiresIn,username} or {error}
 */

const login = async (req, res) => {
  const pass = authServiceInstance.changePasswordAccType(req.body.type, req.body.password);
  const hash = await bcrypt.hash(pass, 10);
  if (req.body.type == "gmail" || req.body.type == "facebook") {
    const decodeReturn = decodeJwt.decodeJwt(req.body.googleOrFacebookToken);
    if (decodeReturn.error != null) {
      return res.status(404).json({
        error: "invalid token",
      });
    }
    const email = decodeReturn.payload.email;
    const data = await authServiceInstance.availabeGmailOrFacebook(email, req.body.type);
    console.log(email);
    console.log(data);
    //case if not available in database random new username and send it
    if (data.exist == false) {
      const username = randomUsername.randomUserName();
      const result = await authServiceInstance.createUser(email, hash, username, req.body.type);
      console.log(result);
      if (result.username != null) {
        const token = authServiceInstance.signToken(req.body.type, username);
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
      const token = authServiceInstance.signToken(req.body.type, data.user_id);
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
        const token = await authServiceInstance.signToken(req.body.type, req.body.username);
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
  availableUsername,
  signup,
  
  login,
};
