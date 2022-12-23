/* eslint-disable */
const Community = require("../models/community-model");
const Post = require("../models/post-model");
const Comment = require("../models/comment-model");
const User = require("../models/user-model");
const CommunityService = require("../services/community-service");
const PostService = require("../services/post-service");

const communityServiceInstance = new CommunityService(Community);
const postServiceInstance = new PostService(Post);

describe("testing uploadCommunityPhoto service in community service class", () => {
  describe("given a file, username, community, type=icon", () => {
    test("should not throw an error", async () => {
      const community = new Community({
        _id: "t5_imagePro235",
        moderators: [
          {
            userID: "t2_moazMohamed",
            role: "moderator",
          },
        ],
      });
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(community);
      Community.prototype.save = jest.fn().mockImplementation(() => {});
      const icon = await communityServiceInstance.uploadCommunityPhoto(
        { filename: "photo.jpg" },
        "t2_moazMohamed",
        "t5_imagePro235",
        "icon"
      );
      expect(icon).toBe("photo.jpg");
    });
  });
  describe("given a file, username, community, type=banner", () => {
    test("should not throw an error", async () => {
      const community = new Community({
        _id: "t5_imagePro235",
        moderators: [
          {
            userID: "t2_moazMohamed",
            role: "moderator",
          },
        ],
      });
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(community);
      Community.prototype.save = jest.fn().mockImplementation(() => {});
      const banner = await communityServiceInstance.uploadCommunityPhoto(
        { filename: "photo.jpg" },
        "t2_moazMohamed",
        "t5_imagePro235",
        "banner"
      );
      expect(banner).toBe("photo.jpg");
    });
  });
  describe("given a file, username, community, type=icon, with user not in moderators", () => {
    test("should throw an error", async () => {
      const community = new Community({
        _id: "t5_imagePro235",
        moderators: [],
      });
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(community);
      Community.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        communityServiceInstance.uploadCommunityPhoto(
          { filename: "photo.jpg" },
          "t2_moazMohamed",
          "t5_imagePro235",
          "icon"
        )
      ).rejects.toThrowError();
    });
  });
  describe("given an undefined file, username, community, type=icon", () => {
    test("should throw an error", async () => {
      const community = new Community({
        _id: "t5_imagePro235",
        moderators: [
          {
            userID: "t2_moazMohamed",
            role: "moderator",
          },
        ],
      });
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(community);
      Community.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        communityServiceInstance.uploadCommunityPhoto(
          undefined,
          "t2_moazMohamed",
          "t5_imagePro235",
          "icon"
        )
      ).rejects.toThrowError();
    });
  });
  describe("given a file, username, invalid community, type=banner", () => {
    test("should not throw an error", async () => {
      const community = undefined;
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(community);
      Community.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        communityServiceInstance.uploadCommunityPhoto(
          { filename: "photo.jpg" },
          "t2_moazMohamed",
          "t5_imagePro235",
          "banner"
        )
      ).rejects.toThrowError();
    });
  });
});

describe("testing getCommunities service in community service class", () => {
  var community = new Community({
    _id: "t5_imagePro235",
    moderators: [
      {
        userID: "t2_moazMohamed",
        role: "moderator",
      },
    ],
    members: [
      {
        userID: "t5_moazMohamed",
        isMuted: false,
        isBanned: false,
      },
    ],
  });
  var user = new User({
    _id: "t2_moazMohamed",
    moderators: [
      {
        communityId: "t5_imagePro235",
        role: "moderator",
      },
    ],
    member: [
      {
        communityId: "t5_imagePro235",
        isMuted: false,
        isBanned: false,
      },
    ],
  });
  describe("given a user, type=moderators", () => {
    test("should not throw an error", async () => {
      communityServiceInstance.find = jest
        .fn()
        .mockReturnValueOnce([community]);
      const communities = await communityServiceInstance.getCommunities(
        user,
        "moderators"
      );
      expect(communities[0]._id).toBe("t5_imagePro235");
    });
  });
  describe("given a user, type=member", () => {
    test("should not throw an error", async () => {
      communityServiceInstance.find = jest
        .fn()
        .mockReturnValueOnce([community]);
      const communities = await communityServiceInstance.getCommunities(
        user,
        "moderators"
      );
      expect(communities[0]._id).toBe("t5_imagePro235");
    });
  });
  describe("given an undefined user, type=member", () => {
    test("should throw an error", async () => {
      communityServiceInstance.find = jest
        .fn()
        .mockReturnValueOnce([community]);
      expect(
        communityServiceInstance.getCommunities(undefined, "moderators")
      ).rejects.toThrowError();
    });
  });
});

describe("testing getSpecificCategory service in community service class", () => {
  describe("given a category=Gaming, page=1, limit=3", () => {
    test("should not throw an error", async () => {
      const communities = [
        {
          _id: "t5_imagePro235",
          category: "Gaming",
        },
        {
          _id: "t5_imagePro23",
          category: "Gaming",
        },
        {
          _id: "t5_imagePro25",
          category: "Gaming",
        },
      ];
      communityServiceInstance.getAll = jest
        .fn()
        .mockReturnValueOnce(communities);
      const communitiesWithCategory =
        await communityServiceInstance.getSpecificCategory({
          category: "Gaming",
          page: "1",
          limit: "3",
        });
      expect(communitiesWithCategory[0]._id).toBe("t5_imagePro235");
    });
  });
  describe("given a category=Gaming, no page or limit", () => {
    test("should not throw an error", async () => {
      const communities = [
        {
          _id: "t5_imagePro235",
          category: "Gaming",
        },
        {
          _id: "t5_imagePro23",
          category: "Gaming",
        },
        {
          _id: "t5_imagePro25",
          category: "Gaming",
        },
      ];
      communityServiceInstance.getAll = jest
        .fn()
        .mockReturnValueOnce(communities);
      const communitiesWithCategory =
        await communityServiceInstance.getSpecificCategory({
          category: "Gaming",
          page: "1",
          limit: "3",
        });
      expect(communitiesWithCategory[0]._id).toBe("t5_imagePro235");
    });
  });
  describe("given an undefined query", () => {
    test("should throw an error", async () => {
      const communities = [
        {
          _id: "t5_imagePro235",
          category: "Gaming",
        },
        {
          _id: "t5_imagePro23",
          category: "Gaming",
        },
        {
          _id: "t5_imagePro25",
          category: "Gaming",
        },
      ];
      communityServiceInstance.getAll = jest
        .fn()
        .mockReturnValueOnce(communities);
      expect(
        communityServiceInstance.getSpecificCategory(undefined)
      ).rejects.toThrowError();
    });
  });
  describe("given an undefined category", () => {
    test("should throw an error", async () => {
      const communities = [
        {
          _id: "t5_imagePro235",
          category: "Gaming",
        },
        {
          _id: "t5_imagePro23",
          category: "Gaming",
        },
        {
          _id: "t5_imagePro25",
          category: "Gaming",
        },
      ];
      communityServiceInstance.getAll = jest
        .fn()
        .mockReturnValueOnce(communities);
      expect(
        communityServiceInstance.getSpecificCategory({
          category: undefined,
        })
      ).rejects.toThrowError();
    });
  });
});

describe("testing banOrMuteAtCommunity service in community service class", () => {
  describe("given a subreddit, moderator, member, operation=ban", () => {
    test("should not throw an error", async () => {
      const community = new Community({
        _id: "t5_imagePro235",
        moderators: [
          {
            userID: "t2_hamada",
            role: "moderator",
          },
        ],
        members: [
          {
            userID: "t2_moazMohamed",
            isMuted: {
              value: false,
            },
            isBanned: {
              value: false,
            },
          },
        ],
      });
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(community);
      const updatedCommunity =
        await communityServiceInstance.banOrMuteAtCommunity(
          "t5_imagePro235",
          "t2_hamada",
          "t2_moazMohamed",
          "ban"
        );
      expect(updatedCommunity.members[0].isBanned.value).toBe(true);
    });
  });
  describe("given a subreddit, moderator, member, operation=unban", () => {
    test("should not throw an error", async () => {
      const community = new Community({
        _id: "t5_imagePro235",
        moderators: [
          {
            userID: "t2_hamada",
            role: "moderator",
          },
        ],
        members: [
          {
            userID: "t2_moazMohamed",
            isMuted: {
              value: false,
            },
            isBanned: {
              value: true,
            },
          },
        ],
      });
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(community);
      const updatedCommunity =
        await communityServiceInstance.banOrMuteAtCommunity(
          "t5_imagePro235",
          "t2_hamada",
          "t2_moazMohamed",
          "unban"
        );
      expect(updatedCommunity.members[0].isBanned.value).toBe(false);
    });
  });
  describe("given a subreddit, moderator, member, operation=mute", () => {
    test("should not throw an error", async () => {
      const community = new Community({
        _id: "t5_imagePro235",
        moderators: [
          {
            userID: "t2_hamada",
            role: "moderator",
          },
        ],
        members: [
          {
            userID: "t2_moazMohamed",
            isMuted: {
              value: false,
            },
            isBanned: {
              value: false,
            },
          },
        ],
      });
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(community);
      const updatedCommunity =
        await communityServiceInstance.banOrMuteAtCommunity(
          "t5_imagePro235",
          "t2_hamada",
          "t2_moazMohamed",
          "mute"
        );
      expect(updatedCommunity.members[0].isMuted.value).toBe(true);
    });
  });
  describe("given a subreddit, moderator, member, operation=unmute", () => {
    test("should not throw an error", async () => {
      const community = new Community({
        _id: "t5_imagePro235",
        moderators: [
          {
            userID: "t2_hamada",
            role: "moderator",
          },
        ],
        members: [
          {
            userID: "t2_moazMohamed",
            isMuted: {
              value: true,
            },
            isBanned: {
              value: false,
            },
          },
        ],
      });
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(community);
      const updatedCommunity =
        await communityServiceInstance.banOrMuteAtCommunity(
          "t5_imagePro235",
          "t2_hamada",
          "t2_moazMohamed",
          "unmute"
        );
      expect(updatedCommunity.members[0].isMuted.value).toBe(false);
    });
  });
  describe("given an undefined subreddit, moderator, member, operation=unmute", () => {
    test("should throw an error", async () => {
      const community = new Community({
        _id: "t5_imagePro235",
        moderators: [
          {
            userID: "t2_hamada",
            role: "moderator",
          },
        ],
        members: [
          {
            userID: "t2_moazMohamed",
            isMuted: {
              value: false,
            },
            isBanned: {
              value: false,
            },
          },
        ],
      });
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(undefined);
      expect(
        communityServiceInstance.banOrMuteAtCommunity(
          "t5_imagePro235",
          "t2_hamada",
          "t2_moazMohamed",
          "unmute"
        )
      ).rejects.toThrowError();
    });
  });
  describe("given a subreddit, not a moderator, member, operation=unmute", () => {
    test("should throw an error", async () => {
      var community = new Community({
        _id: "t5_imagePro235",
        moderators: [],
        members: [
          {
            userID: "t2_moazMohamed",
            isMuted: {
              value: false,
            },
            isBanned: {
              value: false,
            },
          },
        ],
      });
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(community);
      expect(
        communityServiceInstance.banOrMuteAtCommunity(
          "t5_imagePro235",
          "t2_hamada",
          "t2_moazMohamed",
          "unmute"
        )
      ).rejects.toThrowError();
    });
  });
  describe("given a subreddit, moderator, member that is moderator, operation=unmute", () => {
    test("should throw an error", async () => {
      const community = new Community({
        _id: "t5_imagePro235",
        moderators: [
          {
            userID: "t2_hamada",
            role: "moderator",
          },
          {
            userID: "t2_moazMohamed",
            role: "moderator",
          },
        ],
        members: [
          {
            userID: "t2_moazMohamed",
            isMuted: {
              value: false,
            },
            isBanned: {
              value: false,
            },
          },
        ],
      });
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(community);
      expect(
        communityServiceInstance.banOrMuteAtCommunity(
          "t5_imagePro235",
          "t2_hamada",
          "t2_moazMohamed",
          "unmute"
        )
      ).rejects.toThrowError();
    });
  });
});

describe("testing banOrMuteAtUser service in community service class", () => {
  describe("given a toBeAffected, community, operation=ban", () => {
    test("should not throw an error", async () => {
      const community = new Community({
        _id: "t5_imagePro235",
        moderators: [
          {
            userID: "t2_hamada",
            role: "moderator",
          },
        ],
        members: [
          {
            userID: "t2_moazMohamed",
            isMuted: {
              value: false,
            },
            isBanned: {
              value: false,
            },
          },
        ],
      });
      const member = new User({
        _id: "t2_moazMohamed",
        member: [
          {
            userID: "t5_imagePro235",
            isMuted: {
              value: false,
            },
            isBanned: {
              value: false,
            },
          },
        ],
      });
      Community.prototype.save = jest.fn().mockImplementation(() => {});
      User.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        communityServiceInstance.banOrMuteAtUser(member, community, "ban")
      ).resolves.not.toThrowError();
    });
  });
  describe("given a toBeAffected, community, operation=unban", () => {
    test("should not throw an error", async () => {
      const community = new Community({
        _id: "t5_imagePro235",
        moderators: [
          {
            userID: "t2_hamada",
            role: "moderator",
          },
        ],
        members: [
          {
            userID: "t2_moazMohamed",
            isMuted: {
              value: false,
            },
            isBanned: {
              value: true,
            },
          },
        ],
      });
      const member = new User({
        _id: "t2_moazMohamed",
        member: [
          {
            userID: "t5_imagePro235",
            isMuted: {
              value: false,
            },
            isBanned: {
              value: true,
            },
          },
        ],
      });
      Community.prototype.save = jest.fn().mockImplementation(() => {});
      User.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        communityServiceInstance.banOrMuteAtUser(member, community, "unban")
      ).resolves.not.toThrowError();
    });
  });
  describe("given a toBeAffected, community, operation=mute", () => {
    test("should not throw an error", async () => {
      const community = new Community({
        _id: "t5_imagePro235",
        moderators: [
          {
            userID: "t2_hamada",
            role: "moderator",
          },
        ],
        members: [
          {
            userID: "t2_moazMohamed",
            isMuted: {
              value: false,
            },
            isBanned: {
              value: false,
            },
          },
        ],
      });
      const member = new User({
        _id: "t2_moazMohamed",
        member: [
          {
            userID: "t5_imagePro235",
            isMuted: {
              value: false,
            },
            isBanned: {
              value: false,
            },
          },
        ],
      });
      Community.prototype.save = jest.fn().mockImplementation(() => {});
      User.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        communityServiceInstance.banOrMuteAtUser(member, community, "mute")
      ).resolves.not.toThrowError();
    });
  });
  describe("given a toBeAffected, community, operation=unmute", () => {
    test("should not throw an error", async () => {
      const community = new Community({
        _id: "t5_imagePro235",
        moderators: [
          {
            userID: "t2_hamada",
            role: "moderator",
          },
        ],
        members: [
          {
            userID: "t2_moazMohamed",
            isMuted: {
              value: true,
            },
            isBanned: {
              value: false,
            },
          },
        ],
      });
      const member = new User({
        _id: "t2_moazMohamed",
        member: [
          {
            userID: "t5_imagePro235",
            isMuted: {
              value: true,
            },
            isBanned: {
              value: false,
            },
          },
        ],
      });
      Community.prototype.save = jest.fn().mockImplementation(() => {});
      User.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        communityServiceInstance.banOrMuteAtUser(member, community, "unmute")
      ).resolves.not.toThrowError();
    });
  });
  describe("given an undefined toBeAffected, community, operation=unmute", () => {
    test("should not throw an error", async () => {
      const community = new Community({
        _id: "t5_imagePro235",
        moderators: [
          {
            userID: "t2_hamada",
            role: "moderator",
          },
        ],
        members: [
          {
            userID: "t2_moazMohamed",
            isMuted: {
              value: true,
            },
            isBanned: {
              value: false,
            },
          },
        ],
      });
      const member = undefined;
      Community.prototype.save = jest.fn().mockImplementation(() => {});
      User.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        communityServiceInstance.banOrMuteAtUser(member, community, "unmute")
      ).rejects.toThrowError();
    });
  });
});

describe("testing kickAtCommunity service in community service class", () => {
  describe("given a subreddit, moderator, member", () => {
    test("should not throw an error", async () => {
      const community = new Community({
        _id: "t5_imagePro235",
        moderators: [
          {
            userID: "t2_hamada",
            role: "moderator",
          },
        ],
        members: [
          {
            userID: "t2_moazMohamed",
            isMuted: {
              value: false,
            },
            isBanned: {
              value: false,
            },
          },
        ],
      });
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(community);
      const updatedCommunity = await communityServiceInstance.kickAtCommunity(
        "t5_imagePro235",
        "t2_hamada",
        "t2_moazMohamed"
      );
      expect(updatedCommunity.members.length).toBe(0);
    });
  });
  describe("given an undefined subreddit, moderator, member", () => {
    test("should throw an error", async () => {
      const community = new Community({
        _id: "t5_imagePro235",
        moderators: [
          {
            userID: "t2_hamada",
            role: "moderator",
          },
        ],
        members: [
          {
            userID: "t2_moazMohamed",
            isMuted: {
              value: false,
            },
            isBanned: {
              value: false,
            },
          },
        ],
      });
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(undefined);
      expect(
        communityServiceInstance.kickAtCommunity(
          "t5_imagePro235",
          "t2_hamada",
          "t2_moazMohamed"
        )
      ).rejects.toThrowError();
    });
  });
  describe("given a subreddit, not a moderator, member", () => {
    test("should throw an error", async () => {
      var community = new Community({
        _id: "t5_imagePro235",
        moderators: [],
        members: [
          {
            userID: "t2_moazMohamed",
            isMuted: {
              value: false,
            },
            isBanned: {
              value: false,
            },
          },
        ],
      });
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(community);
      expect(
        communityServiceInstance.banOrMuteAtCommunity(
          "t5_imagePro235",
          "t2_hamada",
          "t2_moazMohamed"
        )
      ).rejects.toThrowError();
    });
  });
  describe("given a subreddit, moderator, member that is moderator", () => {
    test("should throw an error", async () => {
      const community = new Community({
        _id: "t5_imagePro235",
        moderators: [
          {
            userID: "t2_hamada",
            role: "moderator",
          },
          {
            userID: "t2_moazMohamed",
            role: "moderator",
          },
        ],
        members: [
          {
            userID: "t2_moazMohamed",
            isMuted: {
              value: false,
            },
            isBanned: {
              value: false,
            },
          },
        ],
      });
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(community);
      expect(
        communityServiceInstance.banOrMuteAtCommunity(
          "t5_imagePro235",
          "t2_hamada",
          "t2_moazMohamed"
        )
      ).rejects.toThrowError();
    });
  });
});

describe("testing kickAtUser service in community service class", () => {
  describe("given a toBeKicked, community", () => {
    test("should not throw an error", async () => {
      const community = new Community({
        _id: "t5_imagePro235",
        moderators: [
          {
            userID: "t2_hamada",
            role: "moderator",
          },
        ],
        members: [
          {
            userID: "t2_moazMohamed",
            isMuted: {
              value: false,
            },
            isBanned: {
              value: false,
            },
          },
        ],
      });
      const member = new User({
        _id: "t2_moazMohamed",
        member: [
          {
            userID: "t5_imagePro235",
            isMuted: {
              value: false,
            },
            isBanned: {
              value: false,
            },
          },
        ],
      });
      Community.prototype.save = jest.fn().mockImplementation(() => {});
      User.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        communityServiceInstance.banOrMuteAtUser(member, community)
      ).resolves.not.toThrowError();
    });
  });
  describe("given an undefined toBeKicked, community", () => {
    test("should not throw an error", async () => {
      const community = new Community({
        _id: "t5_imagePro235",
        moderators: [
          {
            userID: "t2_hamada",
            role: "moderator",
          },
        ],
        members: [
          {
            userID: "t2_moazMohamed",
            isMuted: {
              value: true,
            },
            isBanned: {
              value: false,
            },
          },
        ],
      });
      const member = undefined;
      Community.prototype.save = jest.fn().mockImplementation(() => {});
      User.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        communityServiceInstance.kickAtUser(member, community)
      ).rejects.toThrowError();
    });
  });
});

describe("testing removeSpam service in community service class", () => {
  describe("given a link, spamID, commentOrPostField=spammers", () => {
    test("should not throw an error", async () => {
      const post = new Post({
        _id: "637becd453fc9fc3d423a1d4",
        spammers: [
          {
            spammerID: "t2_hamada",
            _id: "636a8816687a4fec0ac7c3fc",
            spamType: "Hateful Speeach",
            spamText: "jbkjvkj",
          },
        ],
      });
      Post.prototype.save = jest.fn().mockImplementation(() => {});
      Comment.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        communityServiceInstance.removeSpam(
          post,
          "636a8816687a4fec0ac7c3fc",
          "spammers"
        )
      ).resolves.not.toThrowError();
    });
  });
  describe("given a link, spamID, commentOrPostField=spams", () => {
    test("should not throw an error", async () => {
      const comment = new Comment({
        _id: "t1_637becd453fc9fc3d423a1d4",
        spams: [
          {
            spammerID: "t2_hamada",
            _id: "636a8816687a4fec0ac7c3fc",
            spamType: "Hateful Speeach",
            spamText: "jbkjvkj",
          },
        ],
      });
      Post.prototype.save = jest.fn().mockImplementation(() => {});
      Comment.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        communityServiceInstance.removeSpam(
          comment,
          "636a8816687a4fec0ac7c3fc",
          "spams"
        )
      ).resolves.not.toThrowError();
    });
  });
});

describe("testing getBannedOrMuted service in community service class", () => {
  describe("given a subreddit, type=isBanned", () => {
    test("should not throw an error", async () => {
      const community = new Community({
        _id: "t5_imagePro235",
        members: [
          {
            userID: "t2_moazMohamed",
            isMuted: {
              value: false,
            },
            isBanned: {
              value: true,
              date: "2022-12-09T19:16:16.443Z",
            },
          },
          {
            userID: "t2_hamada",
            isMuted: {
              value: false,
            },
            isBanned: {
              value: false,
            },
          },
        ],
      });
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(community);
      const { memberIDs, dates } =
        await communityServiceInstance.getBannedOrMuted(
          "t5_imagePro235",
          "isBanned"
        );
      expect(memberIDs[0]).toBe("t2_moazMohamed");
      expect(dates[0]).toStrictEqual(new Date("2022-12-09T19:16:16.443Z"));
    });
  });
  describe("given a subreddit, type=isMuted", () => {
    test("should not throw an error", async () => {
      const community = new Community({
        _id: "t5_imagePro235",
        members: [
          {
            userID: "t2_moazMohamed",
            isMuted: {
              value: true,
              date: "2022-12-09T19:16:16.443Z",
            },
            isBanned: {
              value: false,
            },
          },
          {
            userID: "t2_hamada",
            isMuted: {
              value: false,
            },
            isBanned: {
              value: false,
            },
          },
        ],
      });
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(community);
      const { memberIDs, dates } =
        await communityServiceInstance.getBannedOrMuted(
          "t5_imagePro235",
          "isMuted"
        );
      expect(memberIDs[0]).toBe("t2_moazMohamed");
      expect(dates[0]).toStrictEqual(new Date("2022-12-09T19:16:16.443Z"));
    });
  });
  describe("given an undefined subreddit, type=isMuted", () => {
    test("should throw an error", async () => {
      const community = undefined;
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(community);
      expect(
        communityServiceInstance.getBannedOrMuted("t5_imagePro235", "isMuted")
      ).rejects.toThrowError();
    });
  });
});

describe("testing getModerators service in community service class", () => {
  describe("given a subreddit", () => {
    test("should not throw an error", async () => {
      const community = new Community({
        _id: "t5_imagePro235",
        moderators: [
          {
            userID: "t2_hamada",
            role: "moderator",
          },
        ],
      });
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(community);
      const { moderatorIDs, crator } =
        await communityServiceInstance.getModerators("t5_imagePro235");
      expect(moderatorIDs[0]).toBe("t2_hamada");
    });
  });
  describe("given an undefined subreddit", () => {
    test("should throw an error", async () => {
      const community = undefined;
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(community);
      expect(
        communityServiceInstance.getModerators("t5_imagePro235")
      ).rejects.toThrowError();
    });
  });
});

describe("testing getMembers service in community service class", () => {
  describe("given a subreddit", () => {
    test("should not throw an error", async () => {
      const community = new Community({
        _id: "t5_imagePro235",
        members: [
          {
            userID: "t2_hamada",
            isBanned: {
              value: true,
              date: "2022-12-09T19:16:16.443Z",
            },
            isMuted: {
              value: false,
            },
          },
          {
            userID: "t2_moazMohamed",
            isBanned: {
              value: false,
            },
            isMuted: {
              value: false,
            },
          },
        ],
      });
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(community);
      const { memberIDs, isBannedAndMuted } =
        await communityServiceInstance.getMembers("t5_imagePro235");
      expect(memberIDs[0]).toBe("t2_hamada");
      expect(isBannedAndMuted[0].isBanned.value).toBe(true);
    });
  });
  describe("given an undefined subreddit", () => {
    test("should throw an error", async () => {
      const community = undefined;
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(community);
      expect(
        communityServiceInstance.getMembers("t5_imagePro235")
      ).rejects.toThrowError();
    });
  });
});

describe("testing getCommunityOptions service in community service class", () => {
  describe("given a subreddit", () => {
    test("should not throw an error", async () => {
      const community = new Community({
        _id: "t5_imagePro235",
        communityOptions: {
          privacyType: "public",
        },
      });
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(community);
      const options = await communityServiceInstance.getCommunityOptions(
        "t5_imagePro235"
      );
      expect(options.privacyType).toBe("public");
    });
  });
  describe("given an undefined subreddit", () => {
    test("should throw an error", async () => {
      const community = undefined;
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(community);
      expect(
        communityServiceInstance.getCommunityOptions("t5_imagePro235")
      ).rejects.toThrowError();
    });
  });
});

describe("testing getThingsIDs service in community service class", () => {
  describe("given a subreddit", () => {
    test("should not throw an error", async () => {
      const ids =
        "t5_imagePro235,t1_636a8816687a4fec0ac7c3fc,t3_639399a76b26f0ddfc9b6d7f,t1_638907ac661b95ab73e85824";
      const thingsIDs = communityServiceInstance.getThingsIDs(ids);
      expect(thingsIDs[0]).toBe("t5_imagePro235");
    });
  });
  describe("given undefined ids", () => {
    test("should throw an error", async () => {
      const ids = undefined;
      try {
        communityServiceInstance.getThingsIDs(ids);
      } catch (err) {
        expect(err.message).toBe("No IDs are provided!");
      }
    });
  });
});

describe("testing getStats service in community service class", () => {
  describe("given a subreddit and type1=joinedPerDay,type2=joinedPerMonth", () => {
    test("should not throw an error", async () => {
      const community = new Community({
        _id: "t5_imagePro235",
        joinedPerDay: [0, 0, 5, 0, 0, 0, 0],
        joinedPerMonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0],
      });
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(community);
      const data = await communityServiceInstance.getStats(
        "t5_imagePro235",
        "joinedPerDay",
        "joinedPerMonth"
      );
      expect(data.days[2]).toBe(5);
      expect(data.months[9]).toBe(20);
    });
  });
  describe("given a subreddit and type1=leftPerDay,type2=leftPerMonth", () => {
    test("should not throw an error", async () => {
      const community = new Community({
        _id: "t5_imagePro235",
        leftPerDay: [0, 0, 5, 0, 0, 0, 0],
        leftPerMonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0],
      });
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(community);
      const data = await communityServiceInstance.getStats(
        "t5_imagePro235",
        "leftPerDay",
        "leftPerMonth"
      );
      expect(data.days[2]).toBe(5);
      expect(data.months[9]).toBe(20);
    });
  });
  describe("given a subreddit and type1=pageViewsPerDay,type2=pageViewsPerMonth", () => {
    test("should not throw an error", async () => {
      const community = new Community({
        _id: "t5_imagePro235",
        pageViewsPerDay: [0, 0, 5, 0, 0, 0, 0],
        pageViewsPerMonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0],
      });
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(community);
      const data = await communityServiceInstance.getStats(
        "t5_imagePro235",
        "pageViewsPerDay",
        "pageViewsPerMonth"
      );
      expect(data.days[2]).toBe(5);
      expect(data.months[9]).toBe(20);
    });
  });
  describe("given an undefined subreddit", () => {
    test("should throw an error", async () => {
      const community = undefined;
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(community);
      expect(
        communityServiceInstance.getStats("t5_imagePro235")
      ).rejects.toThrowError();
    });
  });
});

describe("testing markAsLocked service in community service class", () => {
  describe("given a subreddit, moderator, link", () => {
    test("should not throw an error", async () => {
      const community = new Community({
        _id: "t5_imagePro235",
        moderators: [
          {
            userID: "t2_hamada",
            role: "moderator",
          },
        ],
      });
      const link = new Post({
        _id: "4564",
        title: "mnlknn",
        text: "hdfhdfh",
        communityID: "t5_imagePro235",
        locked: false,
      });
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(community);
      jest.spyOn(Post, "findOne").mockReturnValueOnce(link);
      Post.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        communityServiceInstance.markAsLocked(
          "t5_imagePro235",
          "t2_hamada",
          link
        )
      ).resolves.not.toThrowError();
    });
  });
  describe("given an undefined subreddit, moderator, link", () => {
    test("should throw an error", async () => {
      const link = new Post({
        _id: "4564",
        title: "mnlknn",
        text: "hdfhdfh",
        communityID: "t5_imagePro235",
        locked: false,
      });
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(undefined);
      jest.spyOn(Post, "findOne").mockReturnValueOnce(link);
      Post.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        communityServiceInstance.markAsLocked(undefined, "t2_hamada", link)
      ).rejects.toThrowError();
    });
  });
  describe("given a subreddit, not a moderator, link", () => {
    test("should throw an error", async () => {
      const community = new Community({
        _id: "t5_imagePro235",
        moderators: [
          {
            userID: "t2_hamada",
            role: "moderator",
          },
        ],
      });
      const link = new Post({
        _id: "4564",
        title: "mnlknn",
        text: "hdfhdfh",
        communityID: "t5_imagePro235",
        locked: false,
      });
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(community);
      jest.spyOn(Post, "findOne").mockReturnValueOnce(link);
      Post.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        communityServiceInstance.markAsLocked(
          "t5_imagePro235",
          "t2_moazMohamed",
          link
        )
      ).rejects.toThrowError();
    });
  });
  describe("given a subreddit, moderator, link that is not in this subreddit", () => {
    test("should throw an error", async () => {
      const community = new Community({
        _id: "t5_imagePro235",
        moderators: [
          {
            userID: "t2_hamada",
            role: "moderator",
          },
        ],
      });
      const link = new Post({
        _id: "4564",
        title: "mnlknn",
        text: "hdfhdfh",
        communityID: "t5_Pro235",
        locked: false,
      });
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(community);
      jest.spyOn(Post, "findOne").mockReturnValueOnce(link);
      Post.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        communityServiceInstance.markAsLocked(
          "t5_imagePro235",
          "t2_hamada",
          link
        )
      ).rejects.toThrowError();
    });
  });
});
describe("Test random categories",()=>{
  test("test", async () => {
    communityServiceInstance.getAll=jest.fn().mockReturnValueOnce({});
    const result = await communityServiceInstance.getRandomCommunities({"limit":10});
    expect(result).toStrictEqual({});
  });
});
describe("Test get subbredit about",()=>{
  test("test available one", async () => {
    communityServiceInstance.getOne=jest.fn().mockReturnValueOnce(null);
    const result = await communityServiceInstance.availableSubreddit("t5_notfound");
    expect(result.state).toBe(true);
  });
  test("test not available one", async () => {
    communityServiceInstance.getOne=jest.fn().mockReturnValueOnce({"_id":"t5_imagePro235"});
    const result = await communityServiceInstance.availableSubreddit("t5_imagePro235");
    expect(result.state).toBe(false);
  });
});

describe("Test create subreddit",()=>{
  test("test user cannot create subreddit", async () => {
    var user={"_id":"t2_lotfy2","canCreateSubreddit":false};
    var body={"name":"t5_new","type":"public","over18":false};
    const result = await communityServiceInstance.createSubreddit(body,user);
    expect(result.status).toBe(false);
  });
  test("test user creates  existing subreddit", async () => {
    var user={"_id":"t2_lotfy2","canCreateSubreddit":true};
    var body={"name":"t5_new","type":"public","over18":false};
    communityServiceInstance.availableSubreddit=jest.fn().mockReturnValueOnce({state:false});
    const result = await communityServiceInstance.createSubreddit(body,user);
    expect(result.status).toBe(false);
  });
  test("test user creates  existing subreddit", async () => {
    var user={"_id":"t2_lotfy2","canCreateSubreddit":true};
    var body={"name":"t5_new","type":"public","over18":false};
    communityServiceInstance.availableSubreddit=jest.fn().mockReturnValueOnce({state:true});
    communityServiceInstance.insert=jest.fn().mockReturnValueOnce({});
    const result = await communityServiceInstance.createSubreddit(body,user);
    expect(result.status).toBe(true);
  });
});
describe("Test change comment sort type of subreddit",()=>{
  test("Test change comment sort type of non-existing subreddit", async () => {
    communityServiceInstance.getOne=jest.fn().mockReturnValueOnce(null);
    Community.prototype.save = jest.fn().mockImplementation(() => {});
    const result = await communityServiceInstance.setSuggestedSort("t5_notfound","old");
    expect(result.status).toBe(false);
  });
  // test("Test change comment sort type of existing subreddit", async () => {
  //   communityServiceInstance.getOne=jest.fn().mockReturnValueOnce({"_id":"t5_imagePro235","communityOptions":{"suggestedCommentSort":"new"}});
  //   Community.prototype.save = jest.fn().mockImplementation(() => {});
  //   const result = await communityServiceInstance.setSuggestedSort("t5_notfound","old");
  //   expect(result.status).toBe(true);
  // }); //moza

});
