/* eslint-disable */
const Post = require("../models/post-model");
const mongoose = require('mongoose');
const Community = require("../models/community-model");
const User = require("../models/user-model");
const PostService = require("../services/post-service");
var ObjectID = require("bson").ObjectID;
const mockingoose = require('mockingoose');
const postServiceInstance = new PostService(Post);

describe("testing submit service in post service class", () => {
  describe("given a text, title, attachments (files), user, and community", () => {
    test("should respond with a valid post object", async () => {
      const data = {
        textHTML:
          "This is a post textThis is a post textThis is a post textThis is a post textThis is",
        textJSON:
          "This is a post textThis is a post textThis is a post textThis is a post textThis is",
        title: "This is a post title",
      };
      const files = [
        {
          filename: "test.jpg",
        },
        {
          filename: "test.video",
        },
      ];
      const user = new User({
        _id: "t2_moazMohamed",
        member: [
          {
            communityId: "t5_imagePro235",
            isMuted: {
              value: false,
            },
            isBanned: {
              value: false,
            },
          },
        ],
      });
      const community = {
        _id: "t5_imagePro235",
        communityOptions: {
          privacyType: "public",
        },
      };
      postServiceInstance.insert = jest.fn().mockReturnValueOnce({
        title: "This is a post title",
        attachments: ["test.jpg", "test.video"],
      });
      User.prototype.save = jest.fn().mockImplementation(() => { });
      const newPost = await postServiceInstance.submit(
        data,
        files,
        user,
        community
      );
      expect(newPost.title).toBe("This is a post title");
      expect(newPost.attachments).toStrictEqual(["test.jpg", "test.video"]);
    });
  });
  describe("given a private community and a not member user", () => {
    test("should respond with an error", async () => {
      const data = {
        textHTML:
          "This is a post textThis is a post textThis is a post textThis is a post textThis is",
        textJSON:
          "This is a post textThis is a post textThis is a post textThis is a post textThis is",
        title: "This is a post title",
      };
      const files = [
        {
          filename: "test.jpg",
        },
        {
          filename: "test.video",
        },
      ];
      const user = new User({
        _id: "t2_moazMohamed",
      });
      const community = {
        _id: "t5_imagePro235",
        communityOptions: {
          privacyType: "private",
        },
      };
      postServiceInstance.insert = jest.fn().mockReturnValueOnce({
        title: "This is a post title",
        attachments: ["test.jpg", "test.video"],
      });
      User.prototype.save = jest.fn().mockImplementation(() => { });
      expect(
        postServiceInstance.submit(data, files, user, community)
      ).rejects.toThrowError();
    });
  });
  describe("given invalid & data", () => {
    test("should respond with an error", async () => {
      expect(
        postServiceInstance.submit(undefined, undefined, undefined, undefined)
      ).rejects.toThrowError();
    });
  });
});

describe("testing save service in post service class", () => {
  describe("given a linkID & a user", () => {
    test("should not throw an error", async () => {
      const user = new User({
        _id: "t2_moazMohamed",
        savedPosts: [new ObjectID()],
      });
      User.prototype.save = jest.fn().mockImplementation(() => { });
      expect(
        postServiceInstance.save("t3_637becd453fc9fc3d423a1d4", user)
      ).resolves.not.toThrowError();
    });
  });
  describe("given a previosly saved linkID & a user", () => {
    test("should not throw an error", async () => {
      const user = new User({
        _id: "t2_moazMohamed",
        savedPosts: [new ObjectID("637becd453fc9fc3d423a1d4")],
      });
      User.prototype.save = jest.fn().mockImplementation(() => { });
      expect(
        postServiceInstance.save("t3_637becd453fc9fc3d423a1d4", user)
      ).resolves.not.toThrowError();
    });
  });
  describe("given an invalid linkID & a valid user", () => {
    test("should throw an error", async () => {
      const user = new User({
        _id: "t2_moazMohamed",
        savedPosts: [new ObjectID()],
      });
      User.prototype.save = jest.fn().mockImplementation(() => { });
      expect(postServiceInstance.save(undefined, user)).rejects.toThrowError();
    });
  });
  describe("given a linkID & an invalid user", () => {
    test("should throw an error", async () => {
      User.prototype.save = jest.fn().mockImplementation(() => { });
      expect(
        postServiceInstance.save("t3_637becd453fc9fc3d423a1d4", undefined)
      ).rejects.toThrowError();
    });
  });
});

describe("testing unsave service in post service class", () => {
  describe("given a linkID & a user", () => {
    test("should not throw an error", async () => {
      const user = new User({
        _id: "t2_moazMohamed",
        savedPosts: [new ObjectID()],
      });
      User.prototype.save = jest.fn().mockImplementation(() => { });
      expect(
        postServiceInstance.unsave("t3_637becd453fc9fc3d423a1d4", user)
      ).resolves.not.toThrowError();
    });
  });
  describe("given an invalid linkID & a valid user", () => {
    test("should throw an error", async () => {
      const user = new User({
        _id: "t2_moazMohamed",
        savedPosts: [new ObjectID()],
      });
      User.prototype.save = jest.fn().mockImplementation(() => { });
      expect(
        postServiceInstance.unsave(undefined, user)
      ).rejects.toThrowError();
    });
  });
  describe("given a linkID & an invalid user", () => {
    test("should throw an error", async () => {
      User.prototype.save = jest.fn().mockImplementation(() => { });
      expect(
        postServiceInstance.unsave("t3_637becd453fc9fc3d423a1d4", undefined)
      ).rejects.toThrowError();
    });
  });
});
describe("testing spamPost service in post service class", () => {
  describe("given a post with spamCount < community.communityOptions.spamsNumBeforeRemove, spamType, spamText, username, & community", () => {
    test("should not throw an error", async () => {
      const post = new Post({
        _id: "4564",
        title: "mnlknn",
        textHTML: "hdfhdfh",
        textJSON: "hdfhdfh",
        spammers: [],
        spamCount: 19,
      });
      const community = new Community({
        _id: "t5_imagePro235",
        communityOptions: {
          spamsNumBeforeRemove: 21,
        },
      });
      Post.prototype.save = jest.fn().mockImplementation(() => { });
      expect(
        postServiceInstance.spamPost(
          post,
          "Hateful Speeach",
          "jbkjvkj",
          "t2_moazHassan",
          community
        )
      ).resolves.not.toThrowError();
    });
  });
  describe("given a post with spamCount will be >= community.communityOptions.spamsNumBeforeRemove, spamType, spamText, username, & community", () => {
    test("should not throw an error", async () => {
      const post = new Post({
        _id: "4564",
        title: "mnlknn",
        textHTML: "hdfhdfh",
        textJSON: "hdfhdfh",
        spammers: [],
        spamCount: 20,
      });
      const community = new Community({
        _id: "t5_imagePro235",
        communityOptions: {
          spamsNumBeforeRemove: 21,
        },
      });
      Post.prototype.save = jest.fn().mockImplementation(() => { });
      expect(
        postServiceInstance.spamPost(
          post,
          "Hateful Speeach",
          "jbkjvkj",
          "t2_moazHassan",
          community
        )
      ).resolves.not.toThrowError();
    });
  });
  describe("given a post, spamType, spamText, username that spammed this post before, & community", () => {
    test("should not throw an error", async () => {
      const post = new Post({
        _id: "4564",
        title: "mnlknn",
        textHTML: "hdfhdfh",
        textJSON: "hdfhdfh",
        spammers: [
          {
            spammerID: "t2_moazHassan",
            spamType: "Hateful Speeach",
            spamText: "jbkjvkj",
          },
        ],
        spamCount: 20,
      });
      const community = new Community({
        _id: "t5_imagePro235",
        communityOptions: {
          spamsNumBeforeRemove: 21,
        },
      });
      Post.prototype.save = jest.fn().mockImplementation(() => { });
      expect(
        postServiceInstance.spamPost(
          post,
          "Hateful Speeach",
          "jbkjvkj",
          "t2_moazHassan",
          community
        )
      ).rejects.toThrowError();
    });
  });
});




describe("testing addSortCriteria in post service ", () => {
  describe("sort criteria as srting", () => {
    test("get best sort criteria", async () => {
      expect(
        postServiceInstance.addSortCriteria("best")
      ).toEqual({
        bestFactor: -1,
      });
    });
    test("get hot sort criteria", async () => {
      expect(
        postServiceInstance.addSortCriteria("hot")
      ).toEqual({
        hotnessFactor: -1,
      });
    });
    test("get new sort criteria", async () => {
      expect(
        postServiceInstance.addSortCriteria("new")
      ).toEqual({
        createdAt: -1,
      });
    });
    test("get top sort criteria", async () => {
      expect(
        postServiceInstance.addSortCriteria("top")
      ).toEqual({
        votesCount: -1,
      });
    });
    test("get random sort criteria", async () => {
      expect(
        postServiceInstance.addSortCriteria("random")
      ).toEqual({});
    });
  });
});

