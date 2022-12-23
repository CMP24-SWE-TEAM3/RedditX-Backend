/* eslint-disable */

const Comment = require("../models/comment-model");
const Post = require("../models/post-model");
const Community = require("../models/community-model");
const User = require("../models/user-model");
const CommentService = require("../services/comment-service");

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
      Comment.prototype.save = jest.fn().mockImplementation(() => { });
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
      Comment.prototype.save = jest.fn().mockImplementation(() => { });
      expect(
        commentServiceInstance.saveSpammedComment(comment, community)
      ).resolves.not.toThrowError();
    });
  });
});


describe("testing showComment service in comment service class", () => {
  describe("given a comment", () => {
    let comments = [
      {
        _id: "123",
        isCollapsed: false,
      },
      {
        _id: "456",
        isCollapsed: true
      }
    ]
    test("show collapsed comment", async () => {
      commentServiceInstance.updateOne = jest.fn().mockImplementationOnce((filter, update) => {
        comments.forEach((element, index) => {
          if (element._id == filter._id)
            comments[index].isCollapsed = update.isCollapsed;
        });
      });
      commentServiceInstance.showComment('456');
      expect(comments[1].isCollapsed).toBe(false);
    });
    test("show already un collapsed comment", async () => {
      commentServiceInstance.updateOne = jest.fn().mockImplementationOnce((filter, update) => {
        comments.forEach((element, index) => {
          if (element._id == filter._id)
            comments[index].isCollapsed = update.isCollapsed;
        });
      });

      commentServiceInstance.showComment('123');
      expect(comments[0].isCollapsed).toBe(false);
    });

  });
});






describe("testing approve comment service in comment service class", () => {
  describe("given a comment", () => {
    let comments = [
      Comment({
        _id: "123",
        isDeleted: true,
        spams: [
          'heat speech'
        ],
        spamCount: 40,
      }),
      Comment({
        _id: "456",
        isDeleted: false,
        spams: [],
        spamCount: 0,
      })
    ];
    test("approve un deleted comment", async () => {
      Comment.prototype.save = jest.fn().mockImplementationOnce(() => { });
      commentServiceInstance.approveComment(comments[1]);
      expect(comments[1].isDeleted).toBe(false);
      expect(comments[1].spams.length).toBe(0);
      expect(comments[1].spamCount).toBe(0);
    });
    test("approve un deleted comment", async () => {
      Comment.prototype.save = jest.fn().mockImplementationOnce(() => { });
      commentServiceInstance.approveComment(comments[0]);
      expect(comments[0].isDeleted).toBe(false);
      expect(comments[0].spams.length).toBe(0);
      expect(comments[0].spamCount).toBe(0);
    });
  });
});