/* eslint-disable */
const Comment = require("../models/comment-model");
const Community = require("../models/community-model");
const CommentService = require("../services/comment-service");

const commentServiceInstance = new CommentService(Comment);

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
