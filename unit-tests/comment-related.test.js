/* eslint-disable */

const Comment = require("../models/comment-model");
const Post = require("../models/post-model");
const Community = require("../models/community-model");
const User = require("../models/user-model");
const CommentService = require("../services/comment-service");
const PostService = require("../services/post-service");
const UserService = require("../services/user-service");
const userServiceInstance = new UserService(User);
const postServiceInstance = new PostService(Post);
const commentServiceInstance = new CommentService(Comment);

describe("testing spamComment service in comment service class", () => {
  describe("given a comment, spamType, spamText, and a username", () => {
    test("should not throw an error", async () => {
      var comment = new Comment({
        _id: "4564",
        textHTML: "hdfhdfh",
        textJSON: "hdfhdfh",
        spams: [],
        spamCount: 19,
      });
      comment = await commentServiceInstance.spamComment(
        comment,
        "Hateful Speeach",
        "jbkjvkj",
        "t2_moazHassan"
      );
      expect(comment.spamCount).toBe(20);
      expect(comment.spams[0].type).toBe("Hateful Speeach");
    });
  });
  describe("given a comment, spamType, spamText, and a username that spammed this comment before", () => {
    test("should throw an error", async () => {
      var comment = new Comment({
        _id: "4564",
        textHTML: "hdfhdfh",
        textJSON: "hdfhdfh",
        spams: [
          { userID: "t2_moazHassan", type: "Hateful Speeach", text: "jbkjvkj" },
        ],
        spamCount: 19,
      });
      expect(
        commentServiceInstance.spamComment(
          comment,
          "Hateful Speeach",
          "jbkjvkj",
          "t2_moazHassan"
        )
      ).rejects.toThrowError();
    });
  });
});

describe("testing saveSpammedComment service in comment service class", () => {
  describe("given a comment, and a community with spamCount < community.communityOptions.spamsNumBeforeRemove", () => {
    test("should not throw an error", async () => {
      var comment = new Comment({
        _id: "4564",
        textHTML: "hdfhdfh",
        textJSON: "hdfhdfh",
        spams: [],
        spamCount: 19,
      });
      const community = new Community({
        _id: "t5_imagePro235",
        communityOptions: {
          spamsNumBeforeRemove: 21,
        },
      });
      Comment.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        commentServiceInstance.saveSpammedComment(comment, community)
      ).resolves.not.toThrowError();
    });
  });
  describe("given a comment, and a community with spamCount >= community.communityOptions.spamsNumBeforeRemove", () => {
    test("should not throw an error", async () => {
      var comment = new Comment({
        _id: "4564",
        textHTML: "hdfhdfh",
        textJSON: "hdfhdfh",
        spams: [],
        spamCount: 21,
      });
      const community = new Community({
        _id: "t5_imagePro235",
        communityOptions: {
          spamsNumBeforeRemove: 21,
        },
      });
      Comment.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        commentServiceInstance.saveSpammedComment(comment, community)
      ).resolves.not.toThrowError();
    });
  });
});

describe("testing addComment service in comment service class", () => {
  describe("given a data and user", () => {
    test("should respond with a valid comment object", async () => {
      const data = {
        postID: "637becd453fc9fc3d423a1d4",
        textHTML: "This is a comment textHTML",
        textJSON: "This is a comment textJSON",
      };
      const user = new User({
        _id: "t2_moazMohamed",
      });
      const post = new Post({
        _id: "4564",
        title: "mnlknn",
        text: "hdfhdfh",
        communityID: "t5_imagePro235",
      });
      jest.spyOn(User, "findOne").mockImplementation(() => {
        return user;
      });
      jest.spyOn(Post, "findOne").mockImplementation(() => {
        return post;
      });
      Comment.prototype.save = jest
        .fn()
        .mockReturnValueOnce({
          postID: "637becd453fc9fc3d423a1d4",
          textHTML: "This is a comment textHTML",
          textJSON: "This is a comment textJSON",
          isRoot: true,
          authorId: "t2_moazMohamed",
          replyingTo: "637becd453fc9fc3d423a1d4",
          communityID: "t5_imagePro235",
          voters: [{ userID: "t2_moazMohamed", voteType: 1 }],
        });
      User.prototype.save = jest.fn().mockImplementation(() => {});
      Post.prototype.save = jest.fn().mockImplementation(() => {});
      const newComment = await commentServiceInstance.addComment(
        data,
        "t2_moazMohamed"
      );
      expect(newComment.textHTML).toBe("This is a comment textHTML");
    });
  });
});
