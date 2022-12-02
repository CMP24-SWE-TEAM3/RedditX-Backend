/* eslint-disable */

const Comment = require("../models/comment-model");
const Post = require("../models/post-model");
const Community = require("../models/community-model");
const User = require("../models/user-model");
const CommentService = require("../services/comment-service");

const commentServiceInstance = new CommentService(Comment);
// text:data.text,
// isRoot:true,
// authorId:username,
// replyingTo:data.postID,
// voters: [{userID:username,voteType:1}]

describe("testing addComment service in comment service class", () => {
  describe("given a text,user", () => {
    test("should respond with a valid comment object", async () => {
      const data = {
        _id:"seegdr",
        text: "This is a comment text",
        postID:"dhs6dddh7"
         };
      const user = new User({
        _id: "t2_moazMohamed"
      });
      User.prototype.findById=jest.fn().mockReturnValueOnce(user);
      Post.prototype.findById=jest.fn().mockReturnValueOnce(data.postID);
      Comment.prototype.save = jest.fn().mockReturnValueOnce(data);
      Post.prototype.save = jest.fn().mockImplementation(() => {});
      User.prototype.save = jest.fn().mockImplementation(() => {});
      const newComment = await commentServiceInstance.addComment(
        data,
        user
      );
      expect(newComment.text).toBe("This is a comment text");
    });
  });
  describe("given invalid data", () => {
    test("should respond with an error", async () => {
      expect(
        commentServiceInstance.addComment(undefined, undefined)
      ).rejects.toThrowError();
    });
  });
});
/*
describe("testing addReply service in reply service class", () => {
  describe("given a text,user", () => {
    test("should respond with a valid reply object", async () => {
      const data = {
        text: "This is a reply text",
        commentID:""
      };
      const user = new User({/////ezay ab3tlo commentID
        _id: "t2_moazMohamed"
      });
      commentServiceInstance.insert = jest.fn().mockReturnValueOnce({
        text: "This is a reply text"
      });
      Comment.prototype.save = jest.fn().mockImplementation(() => {});
      const newReply = await commentServiceInstance.addReply(
        data,
        user
      );
      expect(newReply.text).toBe("This is a reply text");
    });
  });
  describe("given invalid data", () => {
    test("should respond with an error", async () => {
      expect(
        commentServiceInstance.addReply(undefined, undefined)
      ).rejects.toThrowError();
    });
  });
});

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
});*/
