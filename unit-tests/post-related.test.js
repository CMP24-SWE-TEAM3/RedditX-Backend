/* eslint-disable */
const Post = require("../models/post-model");
const Community = require("../models/community-model");
const User = require("../models/user-model");
const PostService = require("../services/post-service");
var ObjectID = require("bson").ObjectID;

const postServiceInstance = new PostService(Post);


describe("testing userSubmitted service in post service class", () => {
  describe("given a user", () => {
    test("should not throw an error", async () => {
      const user = new User({
        _id: "t2_moazMohamed",
        hasPost: [new ObjectID()],
      });
      const mockedPosts = [
        {
          createdAt: "2022-11-22T15:08:49.960Z",
          _id: "6373e60c1673969ef16dbbe9",
          communityIcon: "photo.jpg",
          title: "Mute",
          type: "mute",
          text: "imagePro235 has muted you",
          sourceThing: "t5_imagePro235",
          isDeleted: false,
        },
        {
          createdAt: "2022-11-22T15:08:49.960Z",
          _id: "6373e63c1673969ef16dbbeb",
          communityIcon: "photo.jpg",
          title: "Unmute",
          type: "unmute",
          text: "imagePro235 has unmuted you",
          sourceThing: "t5_imagePro235",
          isDeleted: false,
        },
      ];
      postServiceInstance.getAll = jest
        .fn()
        .mockReturnValueOnce(mockedPosts);
      const hasPost = await postServiceInstance.userSubmitted(
        user
      );
      expect(hasPost).toStrictEqual(mockedPosts);
    });
  });
  describe("given a user, and a query with limitt=2", () => {
    test("should not throw an error", async () => {
      const user = new User({
        _id: "t2_moazMohamed",
        hasPost: [new ObjectID()],
      });
      const mockedPosts = [
        {
          createdAt: "2022-11-22T15:08:49.960Z",
          _id: "6373e60c1673969ef16dbbe9",
          communityIcon: "photo.jpg",
          title: "Mute",
          type: "mute",
          text: "imagePro235 has muted you",
          sourceThing: "t5_imagePro235",
          isDeleted: false,
        },
        {
          createdAt: "2022-11-22T15:08:49.960Z",
          _id: "6373e63c1673969ef16dbbeb",
          communityIcon: "photo.jpg",
          title: "Unmute",
          type: "unmute",
          text: "imagePro235 has unmuted you",
          sourceThing: "t5_imagePro235",
          isDeleted: false,
        },
      ];
      postServiceInstance.getAll = jest
        .fn()
        .mockReturnValueOnce(mockedPosts);
      const hasPost = await postServiceInstance.userSubmitted(
        user
      );
      expect(hasPost).toStrictEqual(mockedPosts);
    });
  });
  describe("given an invalid user", () => {
    test("should not throw an error", async () => {
      const user = undefined;
      const mockedPosts = [
        {
          createdAt: "2022-11-22T15:08:49.960Z",
          _id: "6373e60c1673969ef16dbbe9",
          communityIcon: "photo.jpg",
          title: "Mute",
          type: "mute",
          text: "imagePro235 has muted you",
          sourceThing: "t5_imagePro235",
          isDeleted: false,
        },
        {
          createdAt: "2022-11-22T15:08:49.960Z",
          _id: "6373e63c1673969ef16dbbeb",
          communityIcon: "photo.jpg",
          title: "Unmute",
          type: "unmute",
          text: "imagePro235 has unmuted you",
          sourceThing: "t5_imagePro235",
          isDeleted: false,
        },
      ];
      postServiceInstance.getAll = jest
        .fn()
        .mockReturnValueOnce(mockedPosts);
      const hasPost = await postServiceInstance.userSubmitted(
        user
      );
      expect(
        postServiceInstance.userSubmitted(user)
      ).rejects.toThrowError();
    });
  });
});

describe("testing submit service in post service class", () => {
  describe("given a text, title, attachments (files), user, and community", () => {
    test("should respond with a valid post object", async () => {
      const data = {
        text: "This is a post textThis is a post textThis is a post textThis is a post textThis is",
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
            isMuted: false,
            isBanned: false,
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
      User.prototype.save = jest.fn().mockImplementation(() => {});
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
        text: "This is a post textThis is a post textThis is a post textThis is a post textThis is",
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
      User.prototype.save = jest.fn().mockImplementation(() => {});
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
      User.prototype.save = jest.fn().mockImplementation(() => {});
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
      User.prototype.save = jest.fn().mockImplementation(() => {});
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
      User.prototype.save = jest.fn().mockImplementation(() => {});
      expect(postServiceInstance.save(undefined, user)).rejects.toThrowError();
    });
  });
  describe("given a linkID & an invalid user", () => {
    test("should throw an error", async () => {
      User.prototype.save = jest.fn().mockImplementation(() => {});
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
      User.prototype.save = jest.fn().mockImplementation(() => {});
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
      User.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        postServiceInstance.unsave(undefined, user)
      ).rejects.toThrowError();
    });
  });
  describe("given a linkID & an invalid user", () => {
    test("should throw an error", async () => {
      User.prototype.save = jest.fn().mockImplementation(() => {});
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
        text: "hdfhdfh",
        spammers: [],
        spamCount: 19,
      });
      const community = new Community({
        _id: "t5_imagePro235",
        communityOptions: {
          spamsNumBeforeRemove: 21,
        },
      });
      Post.prototype.save = jest.fn().mockImplementation(() => {});
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
        text: "hdfhdfh",
        spammers: [],
        spamCount: 20,
      });
      const community = new Community({
        _id: "t5_imagePro235",
        communityOptions: {
          spamsNumBeforeRemove: 21,
        },
      });
      Post.prototype.save = jest.fn().mockImplementation(() => {});
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
        text: "hdfhdfh",
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
      Post.prototype.save = jest.fn().mockImplementation(() => {});
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
