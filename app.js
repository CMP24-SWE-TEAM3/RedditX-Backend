const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingController = require('./controllers/bookingController');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');

const passport = require('passport');
const session = require('express-session');
const facebookStrategy = require('passport-facebook').Strategy;
const User = require('./models/userModel');
const facebookController = require('./controllers/facebookController');

const app = express();

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.use(cors(/* { credentials: true, origin: 'http://localhost:8000' } */));
app.options('*', cors());
app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);

// MIDDLEWARES

// Set security HTTP headers
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: {
      allowOrigins: ['*'],
    },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ['*'],
        scriptSrc: ["* data: 'unsafe-eval' 'unsafe-inline' blob:"],
        imgSrc: ["* 'self' data: https:"],
      },
    },
  })
);
app.use(session({ secret: process.env.JWT_SECRET }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new facebookStrategy(
    {
      clientID: '1095159117871339',
      clientSecret: '89024f1b7c109c4c5bbd9be6dd6761af',
      callbackURL: 'http://localhost:8000/facebook/callback',
      profileFields: [
        'id',
        'displayName',
        'name',
        'gender',
        'picture.type(large)',
        'email',
      ],
    },
    (token, refreshToken, profile, done) =>
      facebookController.loginFacebook(token, refreshToken, profile, done)
  )
);

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});

// Development logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss()); // prevent dangerous of html and javascript code in the request

// Prevent paramete pollution by preventing for example writing sort twice
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ], // keep multiple durations and all of these
  })
);

// Serving static files
app.use(express.static(`${__dirname}/public`));

app.use(cookieParser());
// Write down the date and log the headers

app.use(compression());
app.use((req, res, next) => {
  req.requestTime = new Date().toLocaleString();
  next();
});

// Limit requests from sam IP address
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000, // Ms: milliseconds, this will allow the same IP address to perform only 100 request per hour
  message:
    'Too many requests from this IP address, please try again in an hour!',
});
app.use('/api', limiter); // limit only api requests

app.post(
  '/webhook-checkout',
  bodyParser.raw({ type: 'application/json' }),
  bookingController.webhookCheckout
);

// Body parser, reading date from body into req.body
app.use(express.json({ limit: '10kb' }));

// ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.get(
  '/auth/facebook',
  passport.authenticate('facebook', { scope: 'email' })
);
app.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/failed',
  })
);
app.get('/profile', facebookController.getProfile);
app.get('/failed', facebookController.getFailed);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404)); // Here will assume that this is an error and skip all middlewares forward to the error handler middleware we defined
});

// Error handler middleware
app.use(globalErrorHandler);
module.exports = app;
