/* eslint-disable */
const Notification = require("../models/notification-model");
const User = require("../models/user-model");
const NotificationService = require("../services/notification-service");
var ObjectID = require("bson").ObjectID;

const notificationServiceInstance = new NotificationService(Notification);

describe("testing getNotifications service in notification service class", () => {
  describe("given a user, and a query with type history", () => {
    test("should not throw an error", async () => {
      const user = new User({
        _id: "t2_moazMohamed",
        notifications: [
          {
            notificationID: "6373e60c1673969ef16dbbe9",
            isDeleted: false,
            isRead: false,
          },
          {
            notificationID: "6373e63c1673969ef16dbbeb",
            isDeleted: true,
            isRead: false,
          },
        ],
      });
      const mockedNotifications = [
        {
          _doc: {
            createdAt: "2022-11-22T15:08:49.960Z",
            _id: "6373e60c1673969ef16dbbe9",
            communityIcon: "photo.jpg",
            title: "Mute",
            type: "mute",
            text: "imagePro235 has muted you",
            sourceThing: "t5_imagePro235",
            isRead: false,
          },
        },
        {
          _doc: {
            createdAt: "2022-11-22T15:08:49.960Z",
            _id: "6373e63c1673969ef16dbbeb",
            communityIcon: "photo.jpg",
            title: "Unmute",
            type: "unmute",
            text: "imagePro235 has unmuted you",
            sourceThing: "t5_imagePro235",
            isRead: false,
          },
        },
      ];
      notificationServiceInstance.getAll = jest
        .fn()
        .mockReturnValueOnce(mockedNotifications);
      const notifications = await notificationServiceInstance.getNotifications(
        user,
        {
          type: "history",
        }
      );
      expect(notifications[0].title).toBe("Mute");
    });
  });
  describe("given a user, and a query with type home", () => {
    test("should not throw an error", async () => {
      const user = new User({
        _id: "t2_moazMohamed",
        notifications: [
          {
            notificationID: "6373e60c1673969ef16dbbe9",
            isDeleted: false,
            isRead: false,
          },
          {
            notificationID: "6373e63c1673969ef16dbbeb",
            isDeleted: true,
            isRead: false,
          },
        ],
      });
      const mockedNotifications = [
        {
          _doc: {
            createdAt: "2022-11-22T15:08:49.960Z",
            _id: "6373e60c1673969ef16dbbe9",
            communityIcon: "photo.jpg",
            title: "Mute",
            type: "mute",
            text: "imagePro235 has muted you",
            sourceThing: "t5_imagePro235",
            isRead: false,
          },
        },
        {
          _doc: {
            createdAt: "2022-11-22T15:08:49.960Z",
            _id: "6373e63c1673969ef16dbbeb",
            communityIcon: "photo.jpg",
            title: "Unmute",
            type: "unmute",
            text: "imagePro235 has unmuted you",
            sourceThing: "t5_imagePro235",
            isRead: false,
          },
        },
      ];
      notificationServiceInstance.getAll = jest
        .fn()
        .mockReturnValueOnce(mockedNotifications);
      const notifications = await notificationServiceInstance.getNotifications(
        user,
        {
          type: "home",
        }
      );
      expect(notifications[0].title).toBe("Mute");
    });
  });
  describe("given a user, and a query with type home and limit=2", () => {
    test("should not throw an error", async () => {
      const user = new User({
        _id: "t2_moazMohamed",
        notifications: [
          {
            notificationID: "6373e60c1673969ef16dbbe9",
            isDeleted: false,
            isRead: false,
          },
          {
            notificationID: "6373e63c1673969ef16dbbeb",
            isDeleted: true,
            isRead: false,
          },
        ],
      });
      const mockedNotifications = [
        {
          _doc: {
            createdAt: "2022-11-22T15:08:49.960Z",
            _id: "6373e60c1673969ef16dbbe9",
            communityIcon: "photo.jpg",
            title: "Mute",
            type: "mute",
            text: "imagePro235 has muted you",
            sourceThing: "t5_imagePro235",
            isRead: false,
          },
        },
        {
          _doc: {
            createdAt: "2022-11-22T15:08:49.960Z",
            _id: "6373e63c1673969ef16dbbeb",
            communityIcon: "photo.jpg",
            title: "Unmute",
            type: "unmute",
            text: "imagePro235 has unmuted you",
            sourceThing: "t5_imagePro235",
            isRead: false,
          },
        },
      ];
      notificationServiceInstance.getAll = jest
        .fn()
        .mockReturnValueOnce(mockedNotifications);
      const notifications = await notificationServiceInstance.getNotifications(
        user,
        {
          type: "home",
          limit: "2",
        }
      );
      expect(notifications[0].title).toBe("Mute");
    });
  });
  describe("given an invalid user, and a query with type home", () => {
    test("should not throw an error", async () => {
      const user = undefined;
      const mockedNotifications = [
        {
          _doc: {
            createdAt: "2022-11-22T15:08:49.960Z",
            _id: "6373e60c1673969ef16dbbe9",
            communityIcon: "photo.jpg",
            title: "Mute",
            type: "mute",
            text: "imagePro235 has muted you",
            sourceThing: "t5_imagePro235",
            isRead: false,
          },
        },
        {
          _doc: {
            createdAt: "2022-11-22T15:08:49.960Z",
            _id: "6373e63c1673969ef16dbbeb",
            communityIcon: "photo.jpg",
            title: "Unmute",
            type: "unmute",
            text: "imagePro235 has unmuted you",
            sourceThing: "t5_imagePro235",
            isRead: false,
          },
        },
      ];
      notificationServiceInstance.getAll = jest
        .fn()
        .mockReturnValueOnce(mockedNotifications);
      expect(
        notificationServiceInstance.getNotifications(user, {
          type: "home",
        })
      ).rejects.toThrowError();
    });
  });
});

describe("testing deleteOrMarkReadUserNotification service in notification service class", () => {
  describe("given a notificationID, user, type=isDeleted", () => {
    test("should not throw an error", async () => {
      var user = new User({
        _id: "t2_moazMohamed",
        notifications: [
          {
            notificationID: "6373e60c1673969ef16dbbe9",
            isDeleted: false,
            isRead: false,
          },
          {
            notificationID: "6373e63c1673969ef16dbbeb",
            isDeleted: true,
            isRead: false,
          },
        ],
      });
      User.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        notificationServiceInstance.deleteOrMarkReadUserNotification(
          "6373e60c1673969ef16dbbe9",
          user,
          "isDeleted"
        )
      ).resolves.not.toThrowError();
    });
  });
  describe("given a notificationID, user, type=isRead", () => {
    test("should not throw an error", async () => {
      var user = new User({
        _id: "t2_moazMohamed",
        notifications: [
          {
            notificationID: "6373e60c1673969ef16dbbe9",
            isDeleted: false,
            isRead: false,
          },
          {
            notificationID: "6373e63c1673969ef16dbbeb",
            isDeleted: true,
            isRead: false,
          },
        ],
      });
      User.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        notificationServiceInstance.deleteOrMarkReadUserNotification(
          "6373e60c1673969ef16dbbe9",
          user,
          "isRead"
        )
      ).resolves.not.toThrowError();
    });
  });
  describe("given a notificationID, undefined user, type=isDeleted", () => {
    test("should not throw an error", async () => {
      var user = undefined;
      User.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        notificationServiceInstance.deleteOrMarkReadUserNotification(
          "6373e60c1673969ef16dbbe9",
          user,
          "isDeleted"
        )
      ).rejects.toThrowError();
    });
  });
  describe("given an undefined notificationID, user, type=isRead", () => {
    test("should not throw an error", async () => {
      var user = new User({
        _id: "t2_moazMohamed",
        notifications: [
          {
            notificationID: "6373e60c1673969ef16dbbe9",
            isDeleted: false,
            isRead: false,
          },
          {
            notificationID: "6373e63c1673969ef16dbbeb",
            isDeleted: true,
            isRead: false,
          },
        ],
      });
      User.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        notificationServiceInstance.deleteOrMarkReadUserNotification(
          undefined,
          user,
          "isRead"
        )
      ).rejects.toThrowError();
    });
  });
});
describe("Test Creating notifications",()=>{
  test("test create new follower notification", async () => {
    notificationServiceInstance.insert=jest.fn().mockReturnValueOnce(null);
    const result= await notificationServiceInstance.createFollowerNotification("t2_lotfy","moza.jpg");
    expect(result.status).toBe(false);

  });
  test("test failed to create new follower notification", async () => {
    notificationServiceInstance.insert=jest.fn().mockReturnValueOnce("not null");
    const result= await notificationServiceInstance.createFollowerNotification("t2_lotfy","moza.jpg");
    expect(result.status).toBe(true);

  });
  test("test failed to create new follower notification", async () => {
    notificationServiceInstance.insert=jest.fn().mockRejectedValueOnce();
    const result= await notificationServiceInstance.createFollowerNotification("t2_lotfy","moza.jpg");
    expect(result.status).toBe(false);
  });
  test("test upvote to comment notification", async () => {
    notificationServiceInstance.insert=jest.fn().mockReturnValueOnce(null);
    const result= await notificationServiceInstance.createUpvoteToCommentNotification("t2_lotfy","moza.jpg");
    expect(result.status).toBe(false);

  });
  test("test failed to upvote to comment notification", async () => {
    notificationServiceInstance.insert=jest.fn().mockReturnValueOnce("not null");
    const result= await notificationServiceInstance.createUpvoteToCommentNotification("t2_lotfy","moza.jpg");
    expect(result.status).toBe(true);

  });
  test("test failed to upvote to comment notification", async () => {
    notificationServiceInstance.insert=jest.fn().mockRejectedValueOnce();
    const result= await notificationServiceInstance.createUpvoteToCommentNotification("t2_lotfy","moza.jpg");
    expect(result.status).toBe(false);

  });

  test("test reply to post notification", async () => {
    notificationServiceInstance.insert=jest.fn().mockReturnValueOnce(null);
    const result= await notificationServiceInstance.createReplyToPostNotification("t2_lotfy","moza.jpg");
    expect(result.status).toBe(false);

  });
  test("test failed to reply to post notification", async () => {
    notificationServiceInstance.insert=jest.fn().mockReturnValueOnce("not null");
    const result= await notificationServiceInstance.createReplyToPostNotification("t2_lotfy","moza.jpg");
    expect(result.status).toBe(true);

  });
  test("test failed to reply to post notification", async () => {
    notificationServiceInstance.insert=jest.fn().mockRejectedValueOnce();
    const result= await notificationServiceInstance.createReplyToPostNotification("t2_lotfy","moza.jpg");
    expect(result.status).toBe(false);

  });
  test("test reply to comment notification", async () => {
    notificationServiceInstance.insert=jest.fn().mockReturnValueOnce(null);
    const result= await notificationServiceInstance.createReplyToCommentNotification("t2_lotfy","moza.jpg");
    expect(result.status).toBe(false);

  });
  test("test failed to reply to comment notification", async () => {
    notificationServiceInstance.insert=jest.fn().mockReturnValueOnce("not null");
    const result= await notificationServiceInstance.createReplyToCommentNotification("t2_lotfy","moza.jpg");
    expect(result.status).toBe(true);

  });
  test("test failed to reply to comment notification", async () => {
    notificationServiceInstance.insert=jest.fn().mockRejectedValueOnce();
    const result= await notificationServiceInstance.createReplyToCommentNotification("t2_lotfy","moza.jpg");
    expect(result.status).toBe(false);

  });
  test("test upvote to post  notification", async () => {
    notificationServiceInstance.insert=jest.fn().mockReturnValueOnce(null);
    const result= await notificationServiceInstance.createUpvoteToPostNotification("t2_lotfy","moza.jpg");
    expect(result.status).toBe(false);

  });
  test("test failed to upvote to post notification", async () => {
    notificationServiceInstance.insert=jest.fn().mockReturnValueOnce("not null");
    const result= await notificationServiceInstance.createUpvoteToPostNotification("t2_lotfy","moza.jpg");
    expect(result.status).toBe(true);

  });
  test("test failed to upvote to post notification", async () => {
    notificationServiceInstance.insert=jest.fn().mockRejectedValueOnce();
    const result= await notificationServiceInstance.createUpvoteToPostNotification("t2_lotfy","moza.jpg");
    expect(result.status).toBe(false);

  });


});

/////////////////////////////////////////////////////
describe("testing deleteNotification service in notification service class", () => {
  describe("given a notification", () => {
    test("should not throw an error", async () => {
      const notification = new Notification({
        createdAt: "2022-11-22T15:08:49.960Z",
        _id: "6373e63c1673969ef16dbbeb",
        communityIcon: "photo.jpg",
        title: "Unmute",
        type: "unmute",
        text: "imagePro235 has unmuted you",
        sourceThing: "t5_imagePro235",
      });
      notificationServiceInstance.getOne = jest
      .fn()
      .mockReturnValueOnce(notification);
      Notification.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        notificationServiceInstance.deleteNotification(notification)
      ).resolves.not.toThrowError();
    });
  });
  describe("given an invalid linkID", () => {
    test("should throw an error", async () => {
      Notification.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        notificationServiceInstance.deleteNotification(undefined)
      ).rejects.toThrowError();
    });
  });
});
