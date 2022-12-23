/* eslint-disable */

const Comment = require("../models/comment-model");
const Post = require("../models/post-model");
const Community = require("../models/community-model");
const User = require("../models/user-model");
const CommentService = require("../services/comment-service");

const commentServiceInstance = new CommentService(Comment);

const UserService = require("../services/user-service");
const userServiceInstance = new UserService(User);

const PostService = require("../services/post-service");
const postServiceInstance = new PostService(Post);

describe("testing spamComment service in comment service class", () => {
  describe("given a comment, spamType, spamText, and a username", () => {
    test("should not throw an error", async () => {
      var comment = new Comment({
        _id: "4564",
        text: "hdfhdfh",
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
        text: "hdfhdfh",
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
        text: "hdfhdfh",
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
        text: "hdfhdfh",
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
////////////////////////////////////////////
describe("testing deleteComment service in comment service class", () => {
  describe("given a comment", () => {
    test("should not throw an error", async () => {
      const comment = new Comment({
        _id: "4564",
        text: "hdfhdfh",
      });
      Comment.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        commentServiceInstance.deleteComment(comment)
      ).resolves.not.toThrowError();
    });
  });
  describe("given an invalid linkID", () => {
    test("should throw an error", async () => {
      Comment.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        commentServiceInstance.deleteComment(undefined)
      ).rejects.toThrowError();
    });
  });
});
////////////////////////////////////////////////
describe("testing addComment service in comment service class", () => {
  describe("given a data and user", () => {
    test("should respond with a valid comment object", async () => {
      const data = {
        textHTML:
          "This is a comment textHTML",
        textJSON:
          "This is a comment textJSON",
        replyingTo:"4564",
      };
      const user = new User({
        _id: "t2_moazMohamed"
      });
      const post = new Post({
        _id: "4564",
        title: "mnlknn",
        text: "hdfhdfh",
        communityID: "t5_imagePro235",
       });
       userServiceInstance.findById = jest
       .fn()
       .mockReturnValueOnce(user);
       postServiceInstance.findById = jest
       .fn()
       .mockReturnValueOnce(post);
       commentServiceInstance.insert = jest.fn().mockReturnValueOnce({
        textHTML:
          "This is a comment textHTML",
        textJSON:
          "This is a comment textJSON",
        replyingTo:"4564",
      });
      User.prototype.save = jest.fn().mockImplementation(() => {});
      Post.prototype.save = jest.fn().mockImplementation(() => {});
      const newComment = await commentServiceInstance.addComment(
        data,
        user
      );
      expect(newComment.data.textHTML).toBe("This is a comment textHTML");
    });
  });
  describe("given invalid & data", () => {
    test("should respond with an error", async () => {
      userServiceInstance.findById = jest
       .fn()
       .mockReturnValueOnce(undefined);
       postServiceInstance.findById = jest
       .fn()
       .mockReturnValueOnce(undefined);
      expect(
        commentServiceInstance.addComment(undefined, undefined)
      ).rejects.toThrowError();
    });
  });
});
describe("testing addReply service in comment service class", () => {
  describe("given a data and user", () => {
    test("should respond with a valid reply object", async () => {
      const data = {
        textHTML:
          "This is a reply textHTML",
        textJSON:
          "This is a reply textJSON",
        replyingTo:"4564",
      };
      const user = new User({
        _id: "t2_moazMohamed"
      });
      const comment = new Comment({
        _id: "4564",
        text: "hdfhdfh"
       });
       userServiceInstance.findById = jest
       .fn()
       .mockReturnValueOnce(user);
       commentServiceInstance.findById = jest
       .fn()
       .mockReturnValueOnce(comment);
       commentServiceInstance.insert = jest.fn().mockReturnValueOnce({
        textHTML:
          "This is a reply textHTML",
        textJSON:
          "This is a reply textJSON",
        replyingTo:"4564",
      });
      User.prototype.save = jest.fn().mockImplementation(() => {});
      Post.prototype.save = jest.fn().mockImplementation(() => {});
      const newReply = await commentServiceInstance.addReply(
        data,
        user
      );
      expect(newReply.data.textHTML).toBe("This is a reply textHTML");
    });
  });
  describe("given invalid & data", () => {
    test("should respond with an error", async () => {
      userServiceInstance.findById = jest
       .fn()
       .mockReturnValueOnce(undefined);
       commentServiceInstance.findById = jest
       .fn()
       .mockReturnValueOnce(undefined);
      expect(
        commentServiceInstance.addReply(undefined, undefined)
      ).rejects.toThrowError();
    });
  });
});
