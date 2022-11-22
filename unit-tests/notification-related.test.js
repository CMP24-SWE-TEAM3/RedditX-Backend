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
        notifications: [new ObjectID()],
      });
      const mockedNotifications = [
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
      notificationServiceInstance.getAll = jest
        .fn()
        .mockReturnValueOnce(mockedNotifications);
      const notifications = await notificationServiceInstance.getNotifications(
        user,
        {
          type: "history",
        }
      );
      expect(notifications).toStrictEqual(mockedNotifications);
    });
  });
  describe("given a user, and a query with type home", () => {
    test("should not throw an error", async () => {
      const user = new User({
        _id: "t2_moazMohamed",
        notifications: [new ObjectID()],
      });
      const mockedNotifications = [
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
      notificationServiceInstance.getAll = jest
        .fn()
        .mockReturnValueOnce(mockedNotifications);
      const notifications = await notificationServiceInstance.getNotifications(
        user,
        {
          type: "home",
        }
      );
      expect(notifications).toStrictEqual(mockedNotifications);
    });
  });
  describe("given a user, and a query with type home and limit=2", () => {
    test("should not throw an error", async () => {
      const user = new User({
        _id: "t2_moazMohamed",
        notifications: [new ObjectID()],
      });
      const mockedNotifications = [
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
      expect(notifications).toStrictEqual(mockedNotifications);
    });
  });
  describe("given an invalid user, and a query with type home", () => {
    test("should not throw an error", async () => {
      const user = undefined;
      const mockedNotifications = [
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
