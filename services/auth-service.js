/**
 * FILE: auth-service
 * description: the services related to authentication only
 * created at: 21/11/2022
 * created by: Ahmed Lotfy
 * authors: Ahmed Lotfy, Shredan Abdullah, Moaz Mohamed, Mohamed Nabil
 */

 const Service = require('./service');
 const jwt = require("jsonwebtoken");
 const bcrypt = require("bcryptjs");
 const decodeJwt = require("../controllers/google-facebook-oAuth");
 const randomUsername = require("../utils/random-username");

class AuthService extends Service {
    constructor(model) {
        super(model);
    }
     /**
  * Check whether user name is in database or not (function)
  * @param {Object} username username of the user.
  * @returns {String} state of the operation whether false or true to indicate the sucess.
  * @returns {Object} user return from the database.
  */
  availableUser = async (username) => {
    const user = await this.getOne({_id:username});
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
 * Signing the token
 * @param {String} emailType email type.
 * @param {String} username username of the user.
 * @returns {String} (signed token)
 */
signToken = (emailType, username) => {
    const res= jwt.sign(
      { emailType: emailType, username: username },
      "mozaisSoHotButNabilisTheHottest",
      { expiresIn: "120h" }
    );

    return res;
  };
  


/**
 * Login 
 * @param {Object} (body)
 * @returns {object} {token,expiresIn,username,state,error} or {state , error}
 */

  login=async(body)=>{
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

/**
 * Signup 
 * @param {Object} (body)
 * @returns {object} {token,expiresIn,username,state,error} or {state , error}
 */
signup=async(body)=>{
  if(!body.password&&(body.type == "gmail" || body.type == "facebook")) 
   var pass = this.changePasswordAccType(body.type, "1");  
  else
   var pass = this.changePasswordAccType(body.type, body.password);
  const hash = await bcrypt.hash(pass, 10);
  if (body.type == "gmail" || body.type == "facebook") {
    console.log("hi");
    const decodeReturn = decodeJwt.decodeJwt(body.googleOrFacebookToken);
    console.log(decodeReturn);
    if (decodeReturn.error != null) {
      return {
        state:false,
        error:"invalid token"

      };
      // return res.status(400).json({
      //   error: "invalid token",
      // });
    }
    const email = await decodeReturn.payload.email;
    console.log(email);
    const data = await this.availabeGmailOrFacebook(email, body.type);
    //case if not available in database random new username and send it
    if (data.exist == false) {
      const username = randomUsername.randomUserName();
      const result = await this.createUser(email, hash, username, body.type);
      if (result.username != null) {
        const token = this.signToken(body.type, username);
        return {
          state:true,
          error:null,
          token: token, //token,
          expiresIn: 3600,
          username: username,
        };
      } else {
        return {
          state:false,
          error:"error"
        };
      }
    } else {
      const token = this.signToken(body.type, data.user_id);
      console.log("tokeeee");
      console.log(token);
      console.log(data.user._id);
      return {
        state:true,
        error:null,
        token: token, //token,
        expiresIn: 3600,
        username: data.user._id,
      };
    }
  }
  else {
    //signup with bare email
    const data = await this.availableEmail(body.email);
    if (data.exist)
    return {
      state:false,
      error: "Duplicate email!",  
      };
    
    const result = await this.createUser(
      body.email,
      hash,
      body.username,
      body.type
    );
    if (result.username != null) {
      const token = await authServiceInstance.signToken(body.type,body.username);

      return {
        state:true,
        error:null,
        token: token, //token,
        expiresIn: 3600,
        username: body.username,
      };
      
    } else {
      return {
        state:false,
        error: "Duplicate email!",  
        };
    }
  }
}

/**
 * Check whether email is in database or not (function)
 * @param {String} email  state of the operation whether false or true to indicate the sucess.
 * @returns {Boolean} exist whether the email exists or not.
 
*/
availableEmail = async (email) => {
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
 * Save user in database
 * @param {String} email email of the user
 * @param {String} hash hashed password
 * @param {String} username username of the user
 * @param {String} type type of the email
 * @returns {object} (status,username)
 */
 createUser = async (email, hash, username, type) => {
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
 * Check whether google account or facebook account is in database or not (function)
 * @param {String} email the email that will be searched by in the database.
 * @param {String} type the type of the email that will be searched by in the database.
 * @returns {Object} user the returned user from the database.
 * @returns {Boolean} exist whether the email exists or not.
 */
availabeGmailOrFacebook = async (email, type) => {
    const user = await this.getOne({ email: email, type: type });
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
 * Change password according to type of email
 * @param {param} type type of the email.
 * @param {param} password password of the email.
 * @returns {String} (type whether '1' or the password parameter).
 */
 changePasswordAccType = (type, password) => {
    return type == "facebook" || type == "gmail" ? "1" : password;
  };
    

    
    
}

module.exports = AuthService;