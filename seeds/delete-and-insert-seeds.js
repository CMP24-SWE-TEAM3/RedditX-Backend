const fs = require("fs");
const User = require("../models/user-model");
const Post = require("../models/post-model");
const Comment = require("../models/comment-model");
const Message = require("../models/message-model");
const Notification = require("../models/notification-model");
const Community = require("../models/community-model");
const dbConnect = require("./../db-connection/connection");

dbConnect();

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
    await User.create(users, { validateBeforeSave: false });
    await Post.create(posts, { validateBeforeSave: false });
    await Comment.create(comments, { validateBeforeSave: false });
    await Community.create(communities, { validateBeforeSave: false });
    await Notification.create(notifications, { validateBeforeSave: false });
    await Message.create(messages, { validateBeforeSave: false });
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
