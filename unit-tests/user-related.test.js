/* eslint-disable */
const User = require("../models/user-model");
const UserService = require("../services/user-service");
const Email = require("./../utils/email");

const userServiceInstance = new UserService(User);

describe("testing uploadUserPhoto service in user service class", () => {
  describe("given a data with action=upload, username, and a file", () => {
    test("should not throw an error", async () => {
      userServiceInstance.findByIdAndUpdate = jest
        .fn()
        .mockImplementationOnce(() => {});
      expect(
        userServiceInstance.uploadUserPhoto("upload", "t2_moazMohamed", {
          filename: "photo.jpg",
        })
      ).resolves.not.toThrowError();
    });
  });
  describe("given a data with action=upload, username, and not a file", () => {
    test("should throw an error", async () => {
      userServiceInstance.findByIdAndUpdate = jest
        .fn()
        .mockImplementationOnce(() => {});
      expect(
        userServiceInstance.uploadUserPhoto(
          "upload",
          "t2_moazMohamed",
          undefined
        )
      ).rejects.toThrowError();
    });
  });
  describe("given a data with action=delete, username", () => {
    test("should not throw an error", async () => {
      userServiceInstance.findByIdAndUpdate = jest
        .fn()
        .mockImplementationOnce(() => {});
      expect(
        userServiceInstance.uploadUserPhoto("delete", "t2_moazMohamed")
      ).resolves.not.toThrowError();
    });
  });
  describe("given a data with undefined action, username, and file", () => {
    test("should throw an error", async () => {
      userServiceInstance.findByIdAndUpdate = jest
        .fn()
        .mockImplementationOnce(() => {});
      expect(
        userServiceInstance.uploadUserPhoto(undefined, "t2_moazMohamed", {
          filename: "photo.jpg",
        })
      ).rejects.toThrowError();
    });
  });
});

describe("testing block service in user service class", () => {
  describe("given a from username, to username, action=true(block)", () => {
    test("should not throw an error", async () => {
      var toUser = new User({
        _id: "t2_moazMohamed",
        blocksToMe: [],
      });
      var fromUser = new User({
        _id: "t2_hamada",
        blocksFromMe: [],
      });
      User.prototype.save = jest.fn().mockImplementation(() => {});
      userServiceInstance.getOne = jest
        .fn()
        .mockReturnValue(toUser)
        .mockReturnValueOnce(fromUser);
      expect(
        userServiceInstance.block("t2_hamada", "t2_moazMohamed", true)
      ).resolves.not.toThrowError();
    });
  });
  describe("given a from username, to username, action=false(unblock)", () => {
    test("should not throw an error", async () => {
      var toUser = new User({
        _id: "t2_moazMohamed",
        blocksToMe: [],
      });
      var fromUser = new User({
        _id: "t2_hamada",
        blocksFromMe: [],
      });
      User.prototype.save = jest.fn().mockImplementation(() => {});
      toUser.blocksToMe[0] = "t2_hamada";
      fromUser.blocksFromMe[0] = "t2_moazMohamed";
      userServiceInstance.getOne = jest
        .fn()
        .mockReturnValue(toUser)
        .mockReturnValueOnce(fromUser);
      expect(
        userServiceInstance.block("t2_hamada", "t2_moazMohamed", false)
      ).resolves.not.toThrowError();
    });
  });
  describe("given a from username, undefined to username, action=true(block)", () => {
    test("should throw an error", async () => {
      var toUser = new User({
        _id: "t2_moazMohamed",
        blocksToMe: [],
      });
      var fromUser = new User({
        _id: "t2_hamada",
        blocksFromMe: [],
      });
      User.prototype.save = jest.fn().mockImplementation(() => {});
      toUser.blocksToMe[0] = "t2_hamada";
      fromUser.blocksFromMe[0] = "t2_moazMohamed";
      userServiceInstance.getOne = jest
        .fn()
        .mockReturnValue(toUser)
        .mockReturnValueOnce(fromUser);
      expect(
        userServiceInstance.block("t2_hamada", undefined, true)
      ).rejects.toThrowError();
    });
  });
  describe("given an invalid from username, invalid to username, action=true(block)", () => {
    test("should throw an error", async () => {
      var toUser = new User({
        _id: "t2_moazMohamed",
        blocksToMe: [],
      });
      var fromUser = new User({
        _id: "t2_hamada",
        blocksFromMe: [],
      });
      User.prototype.save = jest.fn().mockImplementation(() => {});
      toUser.blocksToMe[0] = "t2_hamada";
      fromUser.blocksFromMe[0] = "t2_moazMohamed";
      userServiceInstance.getOne = jest
        .fn()
        .mockReturnValue(undefined)
        .mockReturnValueOnce(undefined);
      expect(
        userServiceInstance.block("t2_hamada", "t2_moazMohamed", true)
      ).rejects.toThrowError();
    });
  });
  describe("given a from username, to username, action=true(block), user is already blocked", () => {
    test("should not throw an error", async () => {
      var toUser = new User({
        _id: "t2_moazMohamed",
        blocksToMe: [],
      });
      var fromUser = new User({
        _id: "t2_hamada",
        blocksFromMe: [],
      });
      User.prototype.save = jest.fn().mockImplementation(() => {});
      userServiceInstance.getOne = jest
        .fn()
        .mockReturnValue(toUser)
        .mockReturnValueOnce(fromUser);
      toUser.blocksToMe[0] = "t2_hamada";
      fromUser.blocksFromMe[0] = "t2_moazMohamed";
      expect(
        userServiceInstance.block("t2_hamada", "t2_moazMohamed", true)
      ).resolves.not.toThrowError();
    });
  });
  describe("given a from username, to username, action=false(unblock), user is already unblocked", () => {
    test("should not throw an error", async () => {
      var toUser = new User({
        _id: "t2_moazMohamed",
        blocksToMe: [],
      });
      var fromUser = new User({
        _id: "t2_hamada",
        blocksFromMe: [],
      });
      User.prototype.save = jest.fn().mockImplementation(() => {});
      userServiceInstance.getOne = jest
        .fn()
        .mockReturnValue(toUser)
        .mockReturnValueOnce(fromUser);
      expect(
        userServiceInstance.block("t2_hamada", "t2_moazMohamed", true)
      ).resolves.not.toThrowError();
    });
  });
});
describe("testing forgotUsername service in user service class", () => {
  describe("given a valid email", () => {
    test("should not throw an error", async () => {
      const user = new User({
        _id: "t2_moazMohamed",
        email: "moaz25jan2015@gmail.com",
      });
      Email.prototype.sendUsername = jest.fn().mockImplementation(() => {});
      userServiceInstance.getOne = jest.fn().mockReturnValueOnce(user);
      expect(
        userServiceInstance.forgotUsername("moaz25jan2015@gmail.com")
      ).resolves.not.toThrowError();
    });
  });
  describe("given an invalid email", () => {
    test("should throw an error", async () => {
      Email.prototype.sendUsername = jest.fn().mockImplementation(() => {});
      userServiceInstance.getOne = jest.fn().mockReturnValueOnce(undefined);
      expect(
        userServiceInstance.forgotUsername("moaz25jan2015@gmail.com")
      ).rejects.toThrowError();
    });
  });
  describe("given a valid email, but error in sending email", () => {
    test("should throw an error", async () => {
      const user = new User({
        _id: "t2_moazMohamed",
        email: "moaz25jan2015@gmail.com",
      });
      Email.prototype.sendUsername = jest
        .fn()
        .mockImplementation(() => Promise.reject("Error in sending mail"));
      userServiceInstance.getOne = jest.fn().mockReturnValueOnce(user);
      expect(
        userServiceInstance.forgotUsername("moaz25jan2015@gmail.com")
      ).rejects.toThrowError();
    });
  });
});

describe("testing forgotPassword service in user service class", () => {
  describe("given a valid username", () => {
    test("should not throw an error", async () => {
      const user = new User({
        _id: "t2_moazMohamed",
        email: "moaz25jan2015@gmail.com",
      });
      Email.prototype.sendPasswordReset = jest
        .fn()
        .mockImplementation(() => {});
      userServiceInstance.getOne = jest.fn().mockReturnValueOnce(user);
      User.prototype.createPasswordResetToken = jest
        .fn()
        .mockReturnValueOnce("hdf45d5a6s465");
      User.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        userServiceInstance.forgotPassword("t2_moazMohamed")
      ).resolves.not.toThrowError();
    });
  });
  describe("given an invalid username", () => {
    test("should throw an error", async () => {
      const user = undefined;
      Email.prototype.sendPasswordReset = jest
        .fn()
        .mockImplementation(() => {});
      userServiceInstance.getOne = jest.fn().mockReturnValueOnce(user);
      User.prototype.createPasswordResetToken = jest
        .fn()
        .mockReturnValueOnce("hdf45d5a6s465");
      User.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        userServiceInstance.forgotPassword("t2_moazMohamed")
      ).rejects.toThrowError();
    });
  });
  describe("given a valid username, but error in sending email", () => {
    test("should throw an error", async () => {
      const user = new User({
        _id: "t2_moazMohamed",
        email: "moaz25jan2015@gmail.com",
      });
      Email.prototype.sendPasswordReset = jest
        .fn()
        .mockImplementation(() => Promise.reject("Error in sending mail"));
      userServiceInstance.getOne = jest.fn().mockReturnValueOnce(user);
      User.prototype.createPasswordResetToken = jest
        .fn()
        .mockReturnValueOnce("hdf45d5a6s465");
      User.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        userServiceInstance.forgotPassword("t2_moazMohamed")
      ).rejects.toThrowError();
    });
  });
});

describe("testing resetForgottenPassword service in user service class", () => {
  describe("given a token, newPassword, confirmedNewPassword", () => {
    test("should not throw an error", async () => {
      const token =
        "76f4701b338573f5486ca7fa489917e4d66144f6a83b2d06b473fc1ba1b12071";
      const newPassword = "moaz42hassan";
      const confirmedNewPassword = "moaz42hassan";
      const user = new User({
        _id: "t2_moazMohamed",
        email: "moaz25jan2015@gmail.com",
      });
      userServiceInstance.getOne = jest.fn().mockReturnValueOnce(user);
      User.prototype.save = jest.fn().mockImplementation(() => {});
      User.prototype.save = jest.fn().mockImplementation(() => {});
      const data = await userServiceInstance.resetForgottenPassword(
        token,
        newPassword,
        confirmedNewPassword
      );
      expect(data.token.length).toBeGreaterThan(20);
      expect(data.id).toBe("t2_moazMohamed");
    });
  });
  describe("given a token, newPassword, confirmedNewPassword, but invalid user", () => {
    test("should throw an error", async () => {
      const token =
        "76f4701b338573f5486ca7fa489917e4d66144f6a83b2d06b473fc1ba1b12071";
      const newPassword = "moaz42hassan";
      const confirmedNewPassword = "moaz42hassan";
      const user = undefined;
      userServiceInstance.getOne = jest.fn().mockReturnValueOnce(user);
      User.prototype.save = jest.fn().mockImplementation(() => {});
      User.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        userServiceInstance.resetForgottenPassword(
          token,
          newPassword,
          confirmedNewPassword
        )
      ).rejects.toThrowError();
    });
  });
  describe("given a token, newPassword, confirmedNewPassword!=newPassword", () => {
    test("should not throw an error", async () => {
      const token =
        "76f4701b338573f5486ca7fa489917e4d66144f6a83b2d06b473fc1ba1b12071";
      const newPassword = "moaz42hassan";
      const confirmedNewPassword = "moaz42haan";
      const user = new User({
        _id: "t2_moazMohamed",
        email: "moaz25jan2015@gmail.com",
      });
      userServiceInstance.getOne = jest.fn().mockReturnValueOnce(user);
      User.prototype.save = jest.fn().mockImplementation(() => {});
      User.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        userServiceInstance.resetForgottenPassword(
          token,
          newPassword,
          confirmedNewPassword
        )
      ).rejects.toThrowError();
    });
  });
});
