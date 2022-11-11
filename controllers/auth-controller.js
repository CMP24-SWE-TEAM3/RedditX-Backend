const jwt = require("jsonwebtoken");
const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const decodeJwt = require("./google-facebook-oAuth");
const randomUsername = require("../utils/random-username");

//check whether user name is in database or not (function)
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

//available-gmailorfacebook (route)
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

//change password according to type of signup
const changePasswordAccType = (type, password) => {
  return type == "facebook" || type == "gmail" ? "1" : password;
};
//signing token
const signToken = (emailType, username) => {
  return jwt.sign(
    { emailType: emailType, username: username },
    "mozaisSoHotButNabilisTheHottest",
    { expiresIn: "24h" }
  );
};

//route (available-username)
const availableUsername = async (req, res) => {
  const data = await availableUser(req.query.username);
  if (data.state == false) {
    return res.status(200).json({
      response: "Avaliable",
    });
  } else {
    return res.status(404).json({
      response: "Not Avaliable",
    });
  }
};

//save User in database
const createUser = async (email, hash, username, type) => {
 
  console.log("h");
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

//route (signup)
const signup = async (req, res) => {
  console.log("entered");
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

    console.log(data);


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
    console.log(result);
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
        console.log("here");
        const token = await signToken(req.body.type, req.body.username);
        return res.status(200).json({
          token: token,
          expiresIn: 3600,
          username: req.body.username,
        });
      })
      .catch((err) => {
        // console.log(err);
        return res.status(401).json({
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

