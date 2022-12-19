const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const User = require("../models/user-model");
const Post = require("../models/post-model");
const Comment = require("../models/comment-model");
const Message = require("../models/message-model");
const Notification = require("../models/notification-model");
const Community = require("../models/community-model");
dotenv.config({ path: "./config.env" });

// Connect to the database
const dbConnectionString = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

// REMOTE DATABASE
mongoose
  .connect(dbConnectionString, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Successfully connected to database");
  });

const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const posts = JSON.parse(fs.readFileSync(`${__dirname}/posts.json`, "utf-8"));
const comments = JSON.parse(
  fs.readFileSync(`${__dirname}/comments.json`, "utf-8")
);
const communities = JSON.parse(
  fs.readFileSync(`${__dirname}/communities.json`, "utf-8")
);
const notifications = JSON.parse(
  fs.readFileSync(`${__dirname}/notifications.json`, "utf-8")
);
const messages = JSON.parse(
  fs.readFileSync(`${__dirname}/messages.json`, "utf-8")
);

/**
 * Inserts all seeds in the collections
 */
const importData = async () => {
  try {
    await User.create(users);
    await Post.create(posts);
    await Comment.create(comments);
    await Community.create(communities);
    await Notification.create(notifications);
    await Message.create(messages);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

/**
 * Deletes all collections' documents
 */
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Post.deleteMany();
    await Comment.deleteMany();
    await Community.deleteMany();
    await Notification.deleteMany();
    await Message.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
