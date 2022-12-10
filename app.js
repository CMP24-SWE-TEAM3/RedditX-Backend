const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const compression = require("compression");
const globalErrorHandler = require("./controllers/error-controller");
const userRouter = require("./routes/user-routes");
const communityRouter = require("./routes/community-routes");
const listingRouter = require("./routes/listing-routes");
const authRouter = require("./routes/auth-routes");
const searchRouter = require("./routes/search-routes");
const notificationRouter = require("./routes/notification-routes");
const postRouter = require("./routes/post-system-routes");
const notRouter=require("./routes/push-notification-routes");
const AppError = require("./utils/app-error");

const app = express();

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
app.use(cors(/* { credentials: true, origin: 'http://localhost:8000' } */));
app.options("*", cors());
app.set("view engine", "pug");
app.set("views", `${__dirname}/views`);

// MIDDLEWARES

// Set security HTTP headers
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: {
      allowOrigins: ["*"],
    },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["*"],
        scriptSrc: ["* data: 'unsafe-eval' 'unsafe-inline' blob:"],
        imgSrc: ["* 'self' data: https:"],
      },
    },
  })
);

// Development logging
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss()); // prevent dangerous of html and javascript code in the request

// Prevent paramete pollution by preventing for example writing sort twice
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
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
  windowMs: 60 * 60 * 1000, // Ms: milliseconds, this will allow the same IP address to perform only 1000 request per hour
  message:
    "Too many requests from this IP address, please try again in an hour!",
});
app.use("/", limiter); // limit only api requests

// Body parser, reading date from body into req.body
app.use(express.json({ limit: "10kb" }));

// ROUTES
app.use("/api/auth", authRouter);
app.use("/not", notRouter);

app.use("/api/user", userRouter);
app.use("/api/r", communityRouter);
app.use("/api/listing", listingRouter);
app.use("/api/search", searchRouter);
app.use("/api/notification", notificationRouter);
app.use("/api", postRouter);
app.all("*", (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server`, 404)
  ); // Here will assume that this is an error and skip all middlewares forward to the error handler middleware we defined
});

// Error handler middleware
app.use(globalErrorHandler.globalErrorHandler);
module.exports = app;
