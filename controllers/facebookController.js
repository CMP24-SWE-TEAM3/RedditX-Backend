const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');

exports.loginFacebook = (token, refreshToken, profile, done) => {
  process.nextTick(() => {
    User.findOne({ uid: profile.id }, function (err, user) {
      if (err) return done(err);
      if (user) {
        user.token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
        user.save((err) => {
          if (err) throw err;
          return done(null, user);
        });
      } else {
        let newUser = new User();
        newUser.uid = profile.id;
        newUser.token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
        newUser.name = profile.name.givenName + ' ' + profile.name.familyName;
        newUser.email = profile.emails[0].value;
        newUser.photo = profile.photos[0].value;
        newUser.save((err) => {
          if (err) throw err;
          return done(null, newUser);
        });
      }
    });
  });
};

exports.getProfile = (req, res) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', req.user.token, cookieOptions);
  res.redirect('/');
};

exports.getFailed = (req, res) => {
  res.redirect('/');
};
