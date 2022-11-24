/* eslint-disable */
const Community = require("../models/community-model");
const User = require("../models/user-model");
const CommunityService = require("../services/community-service");

const communityServiceInstance = new CommunityService(Community);

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
      expect(
        communityServiceInstance.uploadCommunityPhoto(
          { filename: "photo.jpg" },
          "t2_moazMohamed",
          "t5_imagePro235",
          "icon"
        )
      ).resolves.not.toThrowError();
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
      expect(
        communityServiceInstance.uploadCommunityPhoto(
          { filename: "photo.jpg" },
          "t2_moazMohamed",
          "t5_imagePro235",
          "banner"
        )
      ).resolves.not.toThrowError();
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
    test("should not throw an error", async () => {
      communityServiceInstance.find = jest
        .fn()
        .mockReturnValueOnce([community]);
      expect(
        communityServiceInstance.getCommunities(undefined, "moderators")
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
            isMuted: false,
            isBanned: false,
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
      expect(updatedCommunity.members[0].isBanned).toBe(true);
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
            isMuted: false,
            isBanned: true,
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
      expect(updatedCommunity.members[0].isBanned).toBe(false);
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
            isMuted: false,
            isBanned: false,
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
      expect(updatedCommunity.members[0].isMuted).toBe(true);
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
            isMuted: true,
            isBanned: false,
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
      expect(updatedCommunity.members[0].isMuted).toBe(false);
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
            isMuted: false,
            isBanned: false,
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
            isMuted: false,
            isBanned: false,
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
            isMuted: false,
            isBanned: false,
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
            isMuted: false,
            isBanned: false,
          },
        ],
      });
      const member = new User({
        _id: "t2_moazMohamed",
        member: [
          {
            userID: "t5_imagePro235",
            isMuted: false,
            isBanned: false,
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
            isMuted: false,
            isBanned: true,
          },
        ],
      });
      const member = new User({
        _id: "t2_moazMohamed",
        member: [
          {
            userID: "t5_imagePro235",
            isMuted: false,
            isBanned: true,
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
            isMuted: false,
            isBanned: false,
          },
        ],
      });
      const member = new User({
        _id: "t2_moazMohamed",
        member: [
          {
            userID: "t5_imagePro235",
            isMuted: false,
            isBanned: false,
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
            isMuted: true,
            isBanned: false,
          },
        ],
      });
      const member = new User({
        _id: "t2_moazMohamed",
        member: [
          {
            userID: "t5_imagePro235",
            isMuted: true,
            isBanned: false,
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
            isMuted: true,
            isBanned: false,
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

describe("testing getBannedOrMuted service in community service class", () => {
  describe("given a subreddit, type=isBanned", () => {
    test("should not throw an error", async () => {
      const community = new Community({
        _id: "t5_imagePro235",
        members: [
          {
            userID: "t2_moazMohamed",
            isMuted: false,
            isBanned: true,
          },
          {
            userID: "t2_hamada",
            isMuted: false,
            isBanned: false,
          },
        ],
      });
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(community);
      const memberIDs = await communityServiceInstance.getBannedOrMuted(
        community,
        "isBanned"
      );
      expect(memberIDs[0]).toBe("t2_moazMohamed");
    });
  });
  describe("given a subreddit, type=isMuted", () => {
    test("should not throw an error", async () => {
      const community = new Community({
        _id: "t5_imagePro235",
        members: [
          {
            userID: "t2_moazMohamed",
            isMuted: true,
            isBanned: false,
          },
          {
            userID: "t2_hamada",
            isMuted: false,
            isBanned: false,
          },
        ],
      });
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(community);
      const memberIDs = await communityServiceInstance.getBannedOrMuted(
        community,
        "isMuted"
      );
      expect(memberIDs[0]).toBe("t2_moazMohamed");
    });
  });
  describe("given an undefined subreddit, type=isMuted", () => {
    test("should throw an error", async () => {
      const community = undefined;
      communityServiceInstance.getOne = jest
        .fn()
        .mockReturnValueOnce(community);
      expect(
        communityServiceInstance.getBannedOrMuted(community, "isMuted")
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
      const moderatorIDs = await communityServiceInstance.getModerators(
        community
      );
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
        communityServiceInstance.getModerators(community)
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
        community
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
        communityServiceInstance.getCommunityOptions(community)
      ).rejects.toThrowError();
    });
  });
});