/* eslint-disable */
const User = require("../models/user-model");
const Community= require("../models/community-model");
const CommunityService = require("../services/community-service");
const UserService = require("../services/user-service");
const AuthService = require("../services/auth-service");
const Email = require("./../utils/email");
const bcrypt = require("bcryptjs");
var ObjectID = require("bson").ObjectID;
const userServiceInstance = new UserService(User);
const authServiceInstance = new AuthService(User);
const communityServiceInstance = new CommunityService(Community);
jest.setTimeout(1000000);
describe("testing uploadUserPhoto service in user service class", () => {
  describe("given a data with action=upload, username, and a file", () => {
    test("should not throw an error", async () => {
      userServiceInstance.findByIdAndUpdate = jest
        .fn()
        .mockImplementationOnce(() => { });
      const avatar = await userServiceInstance.uploadUserPhoto(
        "upload",
        "t2_moazMohamed",
        {
          filename: "photo.jpg",
        }
      );
      expect(avatar).toBe("photo.jpg");
    });
  });
  describe("given a data with action=upload, username, and not a file", () => {
    test("should throw an error", async () => {
      userServiceInstance.findByIdAndUpdate = jest
        .fn()
        .mockImplementationOnce(() => { });
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
        .mockImplementationOnce(() => { });
      const avatar = await userServiceInstance.uploadUserPhoto(
        "delete",
        "t2_moazMohamed"
      );
      expect(avatar).toBe("default.jpg");
    });
  });
  describe("given a data with undefined action, username, and file", () => {
    test("should throw an error", async () => {
      userServiceInstance.findByIdAndUpdate = jest
        .fn()
        .mockImplementationOnce(() => { });
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
      User.prototype.save = jest.fn().mockImplementation(() => { });
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
      User.prototype.save = jest.fn().mockImplementation(() => { });
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
      User.prototype.save = jest.fn().mockImplementation(() => { });
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
      User.prototype.save = jest.fn().mockImplementation(() => { });
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
      User.prototype.save = jest.fn().mockImplementation(() => { });
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
      User.prototype.save = jest.fn().mockImplementation(() => { });
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
      Email.prototype.sendUsername = jest.fn().mockImplementation(() => { });
      userServiceInstance.getOne = jest.fn().mockReturnValueOnce(user);
      expect(
        userServiceInstance.forgotUsername("moaz25jan2015@gmail.com")
      ).resolves.not.toThrowError();
    });
  });
  describe("given an invalid email", () => {
    test("should throw an error", async () => {
      Email.prototype.sendUsername = jest.fn().mockImplementation(() => { });
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
        .mockImplementation(() => { });
      userServiceInstance.getOne = jest.fn().mockReturnValueOnce(user);
      User.prototype.createPasswordResetToken = jest
        .fn()
        .mockReturnValueOnce("hdf45d5a6s465");
      User.prototype.save = jest.fn().mockImplementation(() => { });
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
        .mockImplementation(() => { });
      userServiceInstance.getOne = jest.fn().mockReturnValueOnce(user);
      User.prototype.createPasswordResetToken = jest
        .fn()
        .mockReturnValueOnce("hdf45d5a6s465");
      User.prototype.save = jest.fn().mockImplementation(() => { });
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
      User.prototype.save = jest.fn().mockImplementation(() => { });
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
      User.prototype.save = jest.fn().mockImplementation(() => { });
      User.prototype.save = jest.fn().mockImplementation(() => { });
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
      User.prototype.save = jest.fn().mockImplementation(() => { });
      User.prototype.save = jest.fn().mockImplementation(() => { });
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
      User.prototype.save = jest.fn().mockImplementation(() => { });
      User.prototype.save = jest.fn().mockImplementation(() => { });
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

describe("testing getFollowing service in community service class", () => {
  describe("given a username", () => {
    test("should not throw an error", async () => {
      const user = new User({
        _id: "t2_nabil",
        follows: ["t2_moazMohamed", "t2_hamada"],
      });
      const follows = [
        {
          _id: "t2_moazMohamed",
          avatar: "default.jpg",
          about: "blabla",
        },
        {
          _id: "t2_hamada",
          avatar: "default.jpg",
          about: "blabla hamada",
        },
      ];
      userServiceInstance.getOne = jest.fn().mockReturnValueOnce(user);
      userServiceInstance.getAll = jest.fn().mockReturnValueOnce(follows);
      const following = await userServiceInstance.getFollowing("t2_nabil");
      expect(following.following[1].about).toBe("blabla hamada");
    });
  });
  describe("given an undefined username", () => {
    test("should throw an error", async () => {
      const user = new User({
        _id: "t2_nabil",
        follows: ["t2_moazMohamed", "t2_hamada"],
      });
      const follows = [
        {
          _id: "t2_moazMohamed",
          avatar: "default.jpg",
          about: "blabla",
        },
        {
          _id: "t2_hamada",
          avatar: "default.jpg",
          about: "blabla hamada",
        },
      ];
      userServiceInstance.getOne = jest.fn().mockReturnValueOnce(user);
      userServiceInstance.find = jest.fn().mockReturnValueOnce(follows);
      expect(
        userServiceInstance.getFollowing(undefined)
      ).rejects.toThrowError();
    });
  });
  describe("given a not found user", () => {
    test("should throw an error", async () => {
      const user = undefined;
      const follows = [
        {
          _id: "t2_moazMohamed",
          avatar: "default.jpg",
          about: "blabla",
        },
        {
          _id: "t2_hamada",
          avatar: "default.jpg",
          about: "blabla hamada",
        },
      ];
      userServiceInstance.getOne = jest.fn().mockReturnValueOnce(user);
      userServiceInstance.find = jest.fn().mockReturnValueOnce(follows);
      expect(
        userServiceInstance.getFollowing("t2_nabil")
      ).rejects.toThrowError();
    });
  });
});
describe("Testing User System", () => {
    describe("Test Signup",()=>{
      describe("Test valid signup using bare email",()=>{
        test("test using valid username and password and email", async () => {
          const body={
            "type":"bare email",
            "username":"t2_lotfy22",
            "password":"lotfy@reddit",
            "email":"lotfy6@rreddit.com"
          };
          authServiceInstance.getOne=jest.fn().mockReturnValueOnce(null);
          authServiceInstance.createUser=jest.fn().mockReturnValueOnce({  username: "t2_lotfy22",
            status: "done"});
          const result = await authServiceInstance.signup(body);
          expect(result.state).toBe(true);  

        });
      });
      describe("Test invalid signup using bare email",()=>{
        test("test using existing email", async () => {
          const user = new User({
            _id: "t2_lotfy2",
            email:"lotfy@rreddit.com",
          });
          const body={
            "type":"bare email",
            "username":"t2_lotfy2",
            "password":"lotfy@reddit",
            "email":"lotfy@rreddit.com"
          };
          authServiceInstance.getOne=jest.fn().mockReturnValueOnce(user);
          const result = await authServiceInstance.signup(body);
          expect(result.error).toBe("Duplicate email!");  
        });
      });
      describe("Test invalid signup using bare email",()=>{
        test("test using existing username", async () => {
          const body={
            "type":"bare email",
            "username":"t2_lotfy2",
            "password":"lotfy@reddit",
            "email":"lotfy@rreddit.com"
          };
          authServiceInstance.getOne=jest.fn().mockReturnValueOnce(null);
          authServiceInstance.createUser=jest.fn().mockReturnValueOnce({  username: null,
          status: "error"});
          const result = await authServiceInstance.signup(body);
          expect(result.state).toBe(false);  
        });
      });
      describe("Test valid signup using gmail auth",()=>{
        test("test using existing user so he will be logged in", async () => {
          const user = new User({
            _id: "t2_lotfy2",
            email:"lotfy@rreddit.com",
          });
          const body={
            "type":"gmail",
            "googleOrFacebookToken":"eyJhbGciOiJSUzI1NiIsImtpZCI6ImE5NmFkY2U5OTk5YmJmNWNkMzBmMjlmNDljZDM3ZjRjNWU2NDI3NDAiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTW9oYW1lZCBpYnJhaGltIE1vdXNzYSBNdXN0YWZhIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FMbTV3dTBFT1ZPTzJlSjNNRDcwV3Q2ZVJDLThxLVd3eDU4VERrdWlXME1OPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3JlZGRpdC1jbG9uZS1hZDY2YyIsImF1ZCI6InJlZGRpdC1jbG9uZS1hZDY2YyIsImF1dGhfdGltZSI6MTY2OTEyODg2MiwidXNlcl9pZCI6IkhrRzVTaG1pbUhUa0NRbWEzOXhjMkRxMU5ObDEiLCJzdWIiOiJIa0c1U2htaW1IVGtDUW1hMzl4YzJEcTFOTmwxIiwiaWF0IjoxNjY5MTI4ODYyLCJleHAiOjE2NjkxMzI0NjIsImVtYWlsIjoibW9oYW1lZHJvbWVlMTJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTM4OTQ4NTY0MDAxMzIzODE4MTUiXSwiZW1haWwiOlsibW9oYW1lZHJvbWVlMTJAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.YQRDqWDcnH1VFfbo8QenfIRXAUHIlhUIIYrWibmSN5qZMQdUpJuUgL47ropSJsvBZ9bOUH7EQ0nW3clb3UCt2Sv-lNnfF5OPF-30rpnz5fHqB2PHGhwj3JRQ7ErsrGG3xHcGJl-jUa2vKNVIY_fz44N07F1ouZvex5_j6pv2z5RizD-w4r32gxTEvV8yvLDhaXJhkkaaYH0DTS8I7avYYXSzMl8iVX54_V4grhYmQX-kLJ7JTSaUFviALhe0IatTb7_5k9GRXrxZW7XDaQxnNgXOa9XB5I4FNt6oUoR8eO-O8q8Qc9T9BBSpX3TMpze-RyUR7G5-odkH84XAKAne4A"
          };
          authServiceInstance.getOne=jest.fn().mockReturnValueOnce(user);
          const result = await authServiceInstance.signup(body);
          expect(result.state).toBe(true);  
        });
      });

      describe("Test valid signup using gmail auth",()=>{
        test("test using new user", async () => {
        
          const body={
            "type":"gmail",
            "googleOrFacebookToken":"eyJhbGciOiJSUzI1NiIsImtpZCI6ImE5NmFkY2U5OTk5YmJmNWNkMzBmMjlmNDljZDM3ZjRjNWU2NDI3NDAiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTW9oYW1lZCBpYnJhaGltIE1vdXNzYSBNdXN0YWZhIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FMbTV3dTBFT1ZPTzJlSjNNRDcwV3Q2ZVJDLThxLVd3eDU4VERrdWlXME1OPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3JlZGRpdC1jbG9uZS1hZDY2YyIsImF1ZCI6InJlZGRpdC1jbG9uZS1hZDY2YyIsImF1dGhfdGltZSI6MTY2OTEyODg2MiwidXNlcl9pZCI6IkhrRzVTaG1pbUhUa0NRbWEzOXhjMkRxMU5ObDEiLCJzdWIiOiJIa0c1U2htaW1IVGtDUW1hMzl4YzJEcTFOTmwxIiwiaWF0IjoxNjY5MTI4ODYyLCJleHAiOjE2NjkxMzI0NjIsImVtYWlsIjoibW9oYW1lZHJvbWVlMTJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTM4OTQ4NTY0MDAxMzIzODE4MTUiXSwiZW1haWwiOlsibW9oYW1lZHJvbWVlMTJAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.YQRDqWDcnH1VFfbo8QenfIRXAUHIlhUIIYrWibmSN5qZMQdUpJuUgL47ropSJsvBZ9bOUH7EQ0nW3clb3UCt2Sv-lNnfF5OPF-30rpnz5fHqB2PHGhwj3JRQ7ErsrGG3xHcGJl-jUa2vKNVIY_fz44N07F1ouZvex5_j6pv2z5RizD-w4r32gxTEvV8yvLDhaXJhkkaaYH0DTS8I7avYYXSzMl8iVX54_V4grhYmQX-kLJ7JTSaUFviALhe0IatTb7_5k9GRXrxZW7XDaQxnNgXOa9XB5I4FNt6oUoR8eO-O8q8Qc9T9BBSpX3TMpze-RyUR7G5-odkH84XAKAne4A"
          };
          authServiceInstance.getOne=jest.fn().mockReturnValueOnce(null);
          authServiceInstance.createUser=jest.fn().mockReturnValueOnce({  username: "t2_lovePizza",
            status: "done"});
          const result = await authServiceInstance.signup(body);
          expect(result.state).toBe(true);  
        });
      });

      describe("Test invalid signup using gmail auth",()=>{
        test("test using invalid token", async () => {
          const body={
            "type":"gmail",
            "googleOrFacebookToken":"eyJhbGciOiJSUzI1NiIsI.67sdf....mtpZCI6ImE5NmFkY2U5OTk5YmJmNWNkMzBmMjlmNDljZDM3ZjRjNWU2NDI3NDAiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTW9oYW1lZCBpYnJhaGltIE1vdXNzYSBNdXN0YWZhIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FMbTV3dTBFT1ZPTzJlSjNNRDcwV3Q2ZVJDLThxLVd3eDU4VERrdWlXME1OPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3JlZGRpdC1jbG9uZS1hZDY2YyIsImF1ZCI6InJlZGRpdC1jbG9uZS1hZDY2YyIsImF1dGhfdGltZSI6MTY2OTEyODg2MiwidXNlcl9pZCI6IkhrRzVTaG1pbUhUa0NRbWEzOXhjMkRxMU5ObDEiLCJzdWIiOiJIa0c1U2htaW1IVGtDUW1hMzl4YzJEcTFOTmwxIiwiaWF0IjoxNjY5MTI4ODYyLCJleHAiOjE2NjkxMzI0NjIsImVtYWlsIjoibW9oYW1lZHJvbWVlMTJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTM4OTQ4NTY0MDAxMzIzODE4MTUiXSwiZW1haWwiOlsibW9oYW1lZHJvbWVlMTJAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.YQRDqWDcnH1VFfbo8QenfIRXAUHIlhUIIYrWibmSN5qZMQdUpJuUgL47ropSJsvBZ9bOUH7EQ0nW3clb3UCt2Sv-lNnfF5OPF-30rpnz5fHqB2PHGhwj3JRQ7ErsrGG3xHcGJl-jUa2vKNVIY_fz44N07F1ouZvex5_j6pv2z5RizD-w4r32gxTEvV8yvLDhaXJhkkaaYH0DTS8I7avYYXSzMl8iVX54_V4grhYmQX-kLJ7JTSaUFviALhe0IatTb7_5k9GRXrxZW7XDaQxnNgXOa9XB5I4FNt6oUoR8eO-O8q8Qc9T9BBSpX3TMpze-RyUR7G5-odkH84XAKAne4A"
          };
    
          const result = await authServiceInstance.signup(body);
          expect(result.state).toBe(false);  
          expect(result.error).toBe("invalid token");  

        });
      });

    
    
    });
    describe("Test Login",()=>{
     
      describe("Test invalid login using bare email",()=>{
        test("test without type", async () => {
        const body={
            "password":"lotfy@reddit.com"
        };
    
          const result = await authServiceInstance.login(body);
          expect(result.state).toBe(false);  
          expect(result.error).toBe("invalid parameters");  

        });
      });
      describe("Test invalid login using bare email",()=>{
        test("test without username", async () => {
        const body={
          "type":"bare email",
          "password":"lotfy@reddit.com"

        };
          const result = await authServiceInstance.login(body);
          expect(result.state).toBe(false);  
          expect(result.error).toBe("invalid parameters");  

        });
      });
      describe("Test invalid login using bare email",()=>{
        test("test using wrong username", async () => {
        const body={
          "type":"bare email",
          "username":"t2_nothere",
          "password":"lotfy@reddit.com"

        };
         authServiceInstance.getOne=jest.fn().mockReturnValueOnce(null);
          const result = await authServiceInstance.login(body);
          expect(result.state).toBe(false);  
          expect(result.error).toBe("Wrong username or password");  

        });
      });
      describe("Test invalid login using bare email",()=>{
        test("test using wrong password", async () => {
          const user = new User({
            _id: "t2_lotfy2",
            email:"lotfy@rreddit.com",
          });
        const body={
          "type":"bare email",
          "username":"t2_nothere",
          "password":"lotfy@reddit.com"

        };
        authServiceInstance.getOne=jest.fn().mockReturnValueOnce(user);
        bcrypt.compareSync=jest.fn().mockReturnValueOnce(false);

        const result = await authServiceInstance.login(body);
        expect(result.state).toBe(false);  
        expect(result.error).toBe("Wrong username or password");  

        });
      });
       describe("Test valid login using bare email",()=>{
        test("test vaild parameters", async () => {
          const user = new User({
            _id: "t2_lotfy2",
            email:"lotfy@rreddit.com",
          });
          const body={
            "type":"bare email",
            "username":"t2_nothere",
            "password":"lotfy@reddit.com"
  
          };
          authServiceInstance.getOne=jest.fn().mockReturnValueOnce(user);
          bcrypt.compareSync=jest.fn().mockReturnValueOnce(true);
          const result = await authServiceInstance.login(body);
          expect(result.state).toBe(true);  

        });
      });
      describe("Test invalid login using gmail auth",()=>{
        test("test without sending token", async () => {
        const body={
          "type":"gmail",
          "username":"t2_nothere",
          "password":"lotfy@reddit.com"

        };
          const result = await authServiceInstance.login(body);
          expect(result.state).toBe(false);  

        });
      });
      describe("Test invalid login using gmail auth",()=>{
        test("test without sending token", async () => {
        const body={
          "type":"gmail",
          "username":"t2_nothere",
          "password":"lotfy@reddit.com",
          "googleOrFacebookToken":"eyJhbGciOiJSUzI1NiIsI,l,mtpZCI6ImE5NmFkY2U5OTk5YmJmNWNkMzBmMjlmNDljZDM3ZjRjNWU2NDI3NDAiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTW9oYW1lZCBpYnJhaGltIE1vdXNzYSBNdXN0YWZhIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FMbTV3dTBFT1ZPTzJlSjNNRDcwV3Q2ZVJDLThxLVd3eDU4VERrdWlXME1OPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3JlZGRpdC1jbG9uZS1hZDY2YyIsImF1ZCI6InJlZGRpdC1jbG9uZS1hZDY2YyIsImF1dGhfdGltZSI6MTY2OTEyODg2MiwidXNlcl9pZCI6IkhrRzVTaG1pbUhUa0NRbWEzOXhjMkRxMU5ObDEiLCJzdWIiOiJIa0c1U2htaW1IVGtDUW1hMzl4YzJEcTFOTmwxIiwiaWF0IjoxNjY5MTI4ODYyLCJleHAiOjE2NjkxMzI0NjIsImVtYWlsIjoibW9oYW1lZHJvbWVlMTJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTM4OTQ4NTY0MDAxMzIzODE4MTUiXSwiZW1haWwiOlsibW9oYW1lZHJvbWVlMTJAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.YQRDqWDcnH1VFfbo8QenfIRXAUHIlhUIIYrWibmSN5qZMQdUpJuUgL47ropSJsvBZ9bOUH7EQ0nW3clb3UCt2Sv-lNnfF5OPF-30rpnz5fHqB2PHGhwj3JRQ7ErsrGG3xHcGJl-jUa2vKNVIY_fz44N07F1ouZvex5_j6pv2z5RizD-w4r32gxTEvV8yvLDhaXJhkkaaYH0DTS8I7avYYXSzMl8iVX54_V4grhYmQX-kLJ7JTSaUFviALhe0IatTb7_5k9GRXrxZW7XDaQxnNgXOa9XB5I4FNt6oUoR8eO-O8q8Qc9T9BBSpX3TMpze-RyUR7G5-odkH84XAKAne4A"
        

        };
          const result = await authServiceInstance.login(body);
          expect(result.state).toBe(false);  
          expect(result.error).toBe("invalid token");  
        });
      });

      describe("Test valid login using gmail auth",()=>{
        test("test using existing username", async () => {
          const user = new User({
            _id: "t2_lotfy2",
            email:"lotfy@rreddit.com",
          });
        const body={
          "type":"gmail",
          "password":"lotfy@reddit.com",
           "googleOrFacebookToken":"eyJhbGciOiJSUzI1NiIsImtpZCI6ImE5NmFkY2U5OTk5YmJmNWNkMzBmMjlmNDljZDM3ZjRjNWU2NDI3NDAiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTW9oYW1lZCBpYnJhaGltIE1vdXNzYSBNdXN0YWZhIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FMbTV3dTBFT1ZPTzJlSjNNRDcwV3Q2ZVJDLThxLVd3eDU4VERrdWlXME1OPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3JlZGRpdC1jbG9uZS1hZDY2YyIsImF1ZCI6InJlZGRpdC1jbG9uZS1hZDY2YyIsImF1dGhfdGltZSI6MTY2OTEyODg2MiwidXNlcl9pZCI6IkhrRzVTaG1pbUhUa0NRbWEzOXhjMkRxMU5ObDEiLCJzdWIiOiJIa0c1U2htaW1IVGtDUW1hMzl4YzJEcTFOTmwxIiwiaWF0IjoxNjY5MTI4ODYyLCJleHAiOjE2NjkxMzI0NjIsImVtYWlsIjoibW9oYW1lZHJvbWVlMTJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTM4OTQ4NTY0MDAxMzIzODE4MTUiXSwiZW1haWwiOlsibW9oYW1lZHJvbWVlMTJAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.YQRDqWDcnH1VFfbo8QenfIRXAUHIlhUIIYrWibmSN5qZMQdUpJuUgL47ropSJsvBZ9bOUH7EQ0nW3clb3UCt2Sv-lNnfF5OPF-30rpnz5fHqB2PHGhwj3JRQ7ErsrGG3xHcGJl-jUa2vKNVIY_fz44N07F1ouZvex5_j6pv2z5RizD-w4r32gxTEvV8yvLDhaXJhkkaaYH0DTS8I7avYYXSzMl8iVX54_V4grhYmQX-kLJ7JTSaUFviALhe0IatTb7_5k9GRXrxZW7XDaQxnNgXOa9XB5I4FNt6oUoR8eO-O8q8Qc9T9BBSpX3TMpze-RyUR7G5-odkH84XAKAne4A"
         };
         authServiceInstance.getOne=jest.fn().mockReturnValueOnce(user);
          const result = await authServiceInstance.login(body);
          expect(result.state).toBe(true);  
        });
      });

      describe("Test valid login using gmail auth",()=>{
        test("test using new username", async () => {
        const body={
          "type":"gmail",
          "username":"t2_lovePizza",
          "password":"lotfy@reddit.com",
           "googleOrFacebookToken":"eyJhbGciOiJSUzI1NiIsImtpZCI6ImE5NmFkY2U5OTk5YmJmNWNkMzBmMjlmNDljZDM3ZjRjNWU2NDI3NDAiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTW9oYW1lZCBpYnJhaGltIE1vdXNzYSBNdXN0YWZhIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FMbTV3dTBFT1ZPTzJlSjNNRDcwV3Q2ZVJDLThxLVd3eDU4VERrdWlXME1OPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3JlZGRpdC1jbG9uZS1hZDY2YyIsImF1ZCI6InJlZGRpdC1jbG9uZS1hZDY2YyIsImF1dGhfdGltZSI6MTY2OTEyODg2MiwidXNlcl9pZCI6IkhrRzVTaG1pbUhUa0NRbWEzOXhjMkRxMU5ObDEiLCJzdWIiOiJIa0c1U2htaW1IVGtDUW1hMzl4YzJEcTFOTmwxIiwiaWF0IjoxNjY5MTI4ODYyLCJleHAiOjE2NjkxMzI0NjIsImVtYWlsIjoibW9oYW1lZHJvbWVlMTJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTM4OTQ4NTY0MDAxMzIzODE4MTUiXSwiZW1haWwiOlsibW9oYW1lZHJvbWVlMTJAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.YQRDqWDcnH1VFfbo8QenfIRXAUHIlhUIIYrWibmSN5qZMQdUpJuUgL47ropSJsvBZ9bOUH7EQ0nW3clb3UCt2Sv-lNnfF5OPF-30rpnz5fHqB2PHGhwj3JRQ7ErsrGG3xHcGJl-jUa2vKNVIY_fz44N07F1ouZvex5_j6pv2z5RizD-w4r32gxTEvV8yvLDhaXJhkkaaYH0DTS8I7avYYXSzMl8iVX54_V4grhYmQX-kLJ7JTSaUFviALhe0IatTb7_5k9GRXrxZW7XDaQxnNgXOa9XB5I4FNt6oUoR8eO-O8q8Qc9T9BBSpX3TMpze-RyUR7G5-odkH84XAKAne4A"
         };
         authServiceInstance.getOne=jest.fn().mockReturnValueOnce(null);
         authServiceInstance.createUser=jest.fn().mockReturnValueOnce({  username: "t2_lovePizza",
            status: "done"});
          const result = await authServiceInstance.login(body);
          expect(result.state).toBe(true);  
        });
      });


    });
    describe("Test username available",()=>{
      describe("Test username is available",()=>{
        test("test", async () => {
          authServiceInstance.getOne=jest.fn().mockReturnValueOnce(null);
          const result = await authServiceInstance.availableUser("t2_notfound");
          expect(result.state).toBe(true);  

        });
      });
      describe("Test username is not available",()=>{
        test("test", async () => {
          const user = new User({
            _id: "t2_lotfy2",
            email:"lotfy@rreddit.com",
          });
          authServiceInstance.getOne=jest.fn().mockReturnValueOnce(user);
          const result = await authServiceInstance.availableUser("t2_found");
          expect(result.state).toBe(false);  

        });
      });
    });
    // describe("Test get my followers",()=>{
    //   test("test", async () => {
    //     userServiceInstance.getOne.select=jest.fn().mockReturnValueOnce({"id":"t2_lotfy2","followers":["t2_nabil","t2_moazMohamed"]});
    //         userServiceInstance.find.select = jest.fn().mockReturnValueOnce(["users"]);

    //     const result = await userServiceInstance.getFollowers("t2_lotfy2");
    //     expect(result.status).toBe(true);  

    //   });

    // });
    describe("Test interests of user",()=>{
      describe("Test get my interests",()=>{
        test("test", async () => {
          userServiceInstance.getOne=jest.fn().mockReturnValueOnce({"_id":"t2_lotfy2","categories":["Gaming","Memess"]});
  
          const result = await userServiceInstance.getInterests("t2_lotfy2");
          expect(result.status).toBe(true);  
  
        });
  
      });
      describe("Test add my interests",()=>{
        test("test", async () => {
          userServiceInstance.updateOne=jest.fn().mockReturnValueOnce({});
  
          const result = await userServiceInstance.addInterests("t2_lotfy2",["Gaming"]);
          expect(result.status).toBe(true);  
  
        });
  
      });
    }); 
   

});

describe("Test Subscribe",()=>{
  describe(("Test subscribe to a user"),()=>{
    test("test success subscribe to user", async () => {
      const body={
        "srName":"t2_nabil",
        "action":"sub"
      };
      const user={
        "_id":"t2_nabil",
        "avatar":"user_image.jpg",
        "followers":["t2_moazMohamed","t2_shredan"],

      }
      authServiceInstance.availableUser=jest.fn().mockReturnValueOnce({"state":true,"user":null});
      jest.spyOn(User, "findOne").mockReturnValueOnce(user);      
      userServiceInstance.getOne=jest.fn().mockReturnValueOnce(null);
      const result = await userServiceInstance.subscribe(body,"t2_nabil");
      expect(result.state).toBe(true);
    });
    test("test subscribe to user not followed", async () => {
      const body={
        "srName":"t2_nabil",
        "action":"unsub"
      };
      const user={
        "_id":"t2_nabil",
        "avatar":"user_image.jpg",
        "followers":["t2_moazMohamed","t2_shredan"],

      }
      authServiceInstance.availableUser=jest.fn().mockReturnValueOnce({"state":true,"user":null});
      jest.spyOn(User, "findOne").mockReturnValueOnce(user);      
      userServiceInstance.getOne=jest.fn().mockReturnValueOnce(null);
      const result = await userServiceInstance.subscribe(body,"t2_nabil");
      expect(result.state).toBe(false);
      expect(result.error).toBe("operation failed the user is already not followed");
    });

  });
  
  describe(("Test subscribe to a subreddit"),()=>{
    test("test subscribe to non existing subreddit", async () => {
      const body={
        "srName":"t5_imagePro2as35",
        "action":"sub"
      };
      const user={
        "_id":"t2_nabil",
        "avatar":"user_image.jpg",
        "followers":["t2_moazMohamed","t2_shredan"],

      } 
      communityServiceInstance.availableSubreddit=jest.fn().mockReturnValueOnce({"state":false});
      jest.spyOn(Community, "findOne").mockReturnValueOnce(null);      
      userServiceInstance.getOne=jest.fn().mockReturnValueOnce(null);
      const result = await userServiceInstance.subscribe(body,"t2_nabil");
      expect(result.state).toBe(false);
      expect(result.error).toBe("invalid subreddit");

    });
    test("test subscribe to existing subreddit but invaild user", async () => {
      const body={
        "srName":"t5_imagePro235",
        "action":"sub"
      };
      const subreddit={
        "_id":"t5_imagePro235"
      };
      const user={
        "_id":"t2_nabil",
        "avatar":"user_image.jpg",
        "followers":["t2_moazMohamed","t2_shredan"],
        "member":[{"communityId":"t5_imagePro"}]
      } 
      communityServiceInstance.availableSubreddit=jest.fn().mockReturnValueOnce({"state":false});
      jest.spyOn(Community, "findOne").mockReturnValueOnce(subreddit);      
      jest.spyOn(User, "findOne").mockReturnValueOnce(null);      

      userServiceInstance.getOne=jest.fn().mockReturnValueOnce(null);
      const result = await userServiceInstance.subscribe(body,"t2_nabil");
      expect(result.state).toBe(false);
      expect(result.error).toBe("invalid username");

    });
    test("test subscribe to existing subreddit but already followed", async () => {
      const body={
        "srName":"t5_imagePro235",
        "action":"sub"
      };
      const subreddit={
        "_id":"t5_imagePro235"
      };
      const user={
        "_id":"t2_nabil",
        "avatar":"user_image.jpg",
        "followers":["t2_moazMohamed","t2_shredan"],
        "member":[{"communityId":"t5_imagePro"},{"communityId":"t5_imagePro235"}]
      } 
      communityServiceInstance.availableSubreddit=jest.fn().mockReturnValueOnce({"state":false,"subreddit":subreddit});
      jest.spyOn(Community, "findOne").mockReturnValueOnce(subreddit);      
      jest.spyOn(User, "findOne").mockReturnValueOnce(user);      

      userServiceInstance.getOne=jest.fn().mockReturnValueOnce(user);
      const result = await userServiceInstance.subscribe(body,"t2_nabil");
      expect(result.state).toBe(false);
      expect(result.error).toBe("already followed");

    });
    test("test unsubscribe to subreddit which is already not followed", async () => {
      const body={
        "srName":"t5_imagePro235ssx",
        "action":"unsub"
      };
      const subreddit={
        "_id":"t5_imagePro235ssx",
        "members":[],
        "membersCnt":20,
        "joinedPerDay":[0,0,0,0,0,0,0],
        "joinedPerMonth":[0,0,0,0,0,0,0,0,0,0,0,0],
        "leftPerDay":[0,0,0,0,0,0,0],
        "leftPerMonth":[0,0,0,0,0,0,0,0,0,0,0,0],

      };
      const user={
        "_id":"t2_nabil",
        "avatar":"user_image.jpg",
        "followers":["t2_moazMohamed","t2_shredan"],
        "member":[{"communityId":"t5_imagePro"},{"communityId":"t5_imagePro235"}]
        
      } 
      communityServiceInstance.availableSubreddit=jest.fn().mockReturnValueOnce({"state":false,"subreddit":subreddit});
      jest.spyOn(Community, "findOne").mockReturnValueOnce(subreddit);      
      jest.spyOn(User, "findOne").mockReturnValueOnce(user);      
      jest.spyOn(User, "updateOne").mockReturnValueOnce(user);      
      jest.spyOn(Community, "updateOne").mockReturnValueOnce(subreddit);      

      userServiceInstance.getOne=jest.fn().mockReturnValueOnce(user);
      const result = await userServiceInstance.subscribe(body,"t2_nabil");
      console.log(result);
      expect(result.state).toBe(false);
      expect(result.error).toBe("operation failed the user is already not followed");

    });
    

  });
  
});

describe("testing userSubmittedPosts service in user service class", () => {
  var user ={
   _id: "t2_moazMohamed",
   hasPost: [
     "4564"
   ],
 };
 describe("given a user", () => {
   test("should not throw an error", async () => {
     userServiceInstance.findById = jest
     .fn()
     .mockReturnValueOnce(user);
     const posts = await userServiceInstance.userSubmittedPosts(
       user
     );
     expect(posts[0]).toBe("4564");
   });
 });
 describe("given an undefined user", () => {
   test("should not throw an error", async () => {
     userServiceInstance.findById = jest
     .fn()
     .mockReturnValueOnce(undefined);
     expect(
       userServiceInstance.userSubmittedPosts(undefined)
     ).rejects.toThrowError();
   });
 });
});
describe("testing userSubmittedComments service in user service class", () => {
 var user = {
  _id: "t2_moazMohamed",
  hasComment: [
    "4564"
  ],
};
describe("given a user", () => {
  test("should not throw an error", async () => {
    userServiceInstance.findById = jest
    .fn()
    .mockReturnValueOnce(user);
    const comments = await userServiceInstance.userSubmittedComments(
      user
    );
    expect(comments[0]).toBe("4564");
  });
});
describe("given an undefined user", () => {
  test("should not throw an error", async () => {
    userServiceInstance.findById = jest
    .fn()
    .mockReturnValueOnce(undefined);
    expect(
      userServiceInstance.userSubmittedComments(undefined)
    ).rejects.toThrowError();
  });
});
});
describe("testing userSubmittedReplies service in user service class", () => {
 var user = {
  _id: "t2_moazMohamed",
  hasReply: [
    "4564"
  ],
};
describe("given a user", () => {
  test("should not throw an error", async () => {
    userServiceInstance.findById = jest
    .fn()
    .mockReturnValueOnce(user);
    const replies = await userServiceInstance.userSubmittedReplies(
      "user"
    );
    expect(replies[0]).toBe("4564");
  });
});
describe("given an undefined user", () => {
  test("should not throw an error", async () => {
    userServiceInstance.findById = jest
    .fn()
    .mockReturnValueOnce(undefined);
    expect(
      userServiceInstance.userSubmittedReplies(undefined)
    ).rejects.toThrowError();
  });
});
});

describe("testing userDownVoted service in user service class", () => {
 var user = {
  _id: "t2_moazMohamed",
  hasVote: [
    {
     postID: "4564",
     type: -1,
    },
  ],
};
describe("given a user", () => {
  test("should not throw an error", async () => {
    userServiceInstance.findById = jest
    .fn()
    .mockReturnValueOnce(user);
    const downVotes = await userServiceInstance.userDownVoted(
      "user"
    );
expect(downVotes[0]).toBe("4564");
  });
});
describe("given an undefined user", () => {
  test("should not throw an error", async () => {
    userServiceInstance.findById = jest
    .fn()
    .mockReturnValueOnce(undefined);
    expect(
      userServiceInstance.userDownVoted(undefined)
    ).rejects.toThrowError();
  });
});
});
//////////////////////////////////
describe("testing userUpVoted service in user service class", () => {
 var user = {
  _id: "t2_moazMohamed",
  hasVote: [
    {
     postID: "4564",
     type: 1,
    },
  ],
};
describe("given a user", () => {
  test("should not throw an error", async () => {
    userServiceInstance.findById = jest
    .fn()
    .mockReturnValueOnce(user);
    const upVotes = await userServiceInstance.userUpVoted(
      "user"
    );
    expect(upVotes[0]).toBe("4564");
  });
});
describe("given an undefined user", () => {
  test("should not throw an error", async () => {
    userServiceInstance.findById = jest
    .fn()
    .mockReturnValueOnce(undefined);
    expect(
      userServiceInstance.userUpVoted(undefined)
    ).rejects.toThrowError();
  });
});
});
//////////////////////////////////

describe("testing userMentions service in user service class", () => {
 var user = {
  _id: "t2_moazMohamed",
  mentionedInPosts: [
    "4564"
  ],
};
describe("given a user", () => {
  test("should not throw an error", async () => {
    userServiceInstance.findById = jest
    .fn()
    .mockReturnValueOnce(user);
    const posts = await userServiceInstance.userMentions(
      "user"
    );
    expect(posts[0]).toBe("4564");
  });
});
describe("given an undefined user", () => {
  test("should not throw an error", async () => {
    userServiceInstance.findById = jest
    .fn()
    .mockReturnValueOnce(undefined);
    expect(
      userServiceInstance.userMentions(undefined)
    ).rejects.toThrowError();
  });
});
});

//////////////////////////////////
describe("testing userSavedPosts service in user service class", () => {
 var user = ({
  _id: "t2_moazMohamed",
  savedPosts: [
    "4564"
    ],
});
describe("given a user", () => {
  test("should not throw an error", async () => {
    userServiceInstance.findById = jest
    .fn()
    .mockReturnValueOnce(user);
    const posts = await userServiceInstance.userSavedPosts(
     "t2_moazMohamed"
    );
    console.log(posts);
    expect(posts[0]).toBe("4564");
  });
});
describe("given an undefined user", () => {
  test("should not throw an error", async () => {
    userServiceInstance.findById = jest
    .fn()
    .mockReturnValueOnce(undefined);
    expect(
      userServiceInstance.userSavedPosts(undefined)
    ).rejects.toThrowError();
  });
});
});
//////////////////////////////////
describe("testing userMe service in user service class", () => {
 const user={
"prefs":{"commentsNum":"23",
"threadedMessages":false,
"countryCode":"PS",
"langauge":false,
"over18":false,
"defaultCommentSort":"new",
"showLocationBasedRecommendations":false,
"searchInclude18":false,
"publicVotes":false,
"enableFollwers":false,
"liveOrangereds":false,
"labelNSFW":false,
"showPostInNewWindow":false,
"emailPrivateMessage":false,
"emailPostReply":false,
"emailMessages":false,
"emailCommentReply":false,
"emailUpvoteComment":false,
"showLinkFlair":false},
"about":"oioip",
"avatar":"rtyyuu",
"_id":"553535",
"showActiveCommunities":false,
"meReturn":{"emailUserNewFollwer":true,
"emailUpVotePost":true,
"emailUsernameMention":true}
};
describe("given a user", () => {
  test("should not throw an error", async () => {
    userServiceInstance.findById = jest
    .fn()
    .mockReturnValueOnce(user);
    const meInfo = await userServiceInstance.userMe(
      user
    );
    expect(meInfo.user.avatar).toBe("rtyyuu");
  });
});
describe("given an undefined user", () => {
  test("should not throw an error", async () => {
    userServiceInstance.findById = jest
    .fn()
    .mockReturnValueOnce(undefined);
    expect(
      userServiceInstance.userMe(undefined)
    ).rejects.toThrowError();
  });
});
});

describe("testing userAbout service in user service class", () => {
 const user={"createdAt":"253",
"aboutReturn":{"prefShowTrending":true,
"isBlocked":false,
"isMod":false,
"acceptFollowers":false},
"canCreateSubreddit":false,
"hasVerifiedEmail":false,
"canCreateSubreddit":false,
"inboxCount":false,
"totalKarma":"10",
"linkKarma":"10",
"commentKarma":"10",
"passwordSet":"10",
"email":"sesee",
"about":"uuoiu",
"avatar":"popopop",
"userID":"8786767",
"member":{"isBanned":true,
"isMuted":false},
"prefs":{"over18":true},
"followers":{"length":true}
   
};
describe("given a user", () => {
  test("should not throw an error", async () => {
    userServiceInstance.findById = jest
    .fn()
    .mockReturnValueOnce(user);
    const about = await userServiceInstance.userAbout(
      user
    );
    expect(about.user.avatar).toBe("popopop");
  });
});
describe("given an undefined user", () => {
  test("should not throw an error", async () => {
    userServiceInstance.findById = jest
    .fn()
    .mockReturnValueOnce(undefined);
    expect(
      userServiceInstance.userAbout(undefined)
    ).rejects.toThrowError();
  });
});
});
describe("testing resetPassword service in auth service class", () => {
 describe("given a username,currentPassword,newPassword, confirmedNewPassword", () => {
   test("should not throw an error", async () => {
     const user = new User({
       _id: "t2_moazMohamed",
       email: "moaz25jan2015@gmail.com",
     });
     bcrypt.compare=jest.fn().mockReturnValueOnce(true);
     userServiceInstance.getOne = jest.fn().mockReturnValueOnce(user);
     User.prototype.save = jest.fn().mockImplementation(() => {});
     const data = await userServiceInstance.resetPassword(
       "user",
       "oldpass",
       "moaz42hassan",
       "moaz42hassan"
     );
   });
 });
 describe("given a currentPassword, newPassword, confirmedNewPassword, but invalid user", () => {
   test("should throw an error", async () => {
     userServiceInstance.getOne = jest.fn().mockReturnValueOnce(undefined);
     User.prototype.save = jest.fn().mockImplementation(() => {});
     expect(
       userServiceInstance.resetPassword(
         undefined,
         "oldpass",
         "moaz42hassan",
         "moaz42hassan"
       )
     ).rejects.toThrowError();
   });
 });
 describe("given a a username,currentPassword, newPassword, confirmedNewPassword!=newPassword", () => {
   test("should throw an error", async () => {
     const user = new User({
       _id: "t2_moazMohamed",
       email: "moaz25jan2015@gmail.com",
     });
     userServiceInstance.getOne = jest.fn().mockReturnValueOnce(user);
     User.prototype.save = jest.fn().mockImplementation(() => {});
     User.prototype.save = jest.fn().mockImplementation(() => {});
     expect(
       userServiceInstance.resetPassword(
         "user",
       "oldpass",
       "moaz42hassan",
       "moaz4assan"
       )
     ).rejects.toThrowError();
   });
 });
});


describe("testing kickModerator in community service", () => {
  describe("given subreddit id and moderator", () => {
    let users = [
      User({
        _id: '123',
        moderators: [
          'nabil123',
          'moaz123'
        ]
      }),
      User({
        _id: '456',
        moderators: [
          'nabil123',
        ]
      })
    ]
    test("kick one of the moderators", async () => {
      userServiceInstance.getOne = jest.fn().mockReturnValueOnce(users[0]);
      User.prototype.save = jest.fn().mockImplementationOnce(() => { });
      expect(userServiceInstance.kickModerator('123', 'nabil123')).resolves.not.toThrowError();
    });
  });
});


describe("testing isCreatorInSubreddit in community service", () => {
  describe("given subreddit id and moderator", () => {
    let users = [
      User({
        _id: 'nabil123',
        moderators: [
          {
            communityId: 't5_imagePro235',
            role: 'creator'
          }
        ]
      }),
      User({
        _id: 'lotfy12',
        moderators: [
          {
            communityId: 't5_imagePro235',
            role: 'moderator'
          }
        ]
      })
    ]
    test("test if the person is creator", async () => {
      userServiceInstance.getOne = jest.fn().mockReturnValueOnce(users[0]);
      expect(await userServiceInstance.isCreatorInSubreddit('t5_imagePro235', 'nabil123')).toBe(true);
      userServiceInstance.getOne = jest.fn().mockReturnValueOnce(users[1]);
      expect(await userServiceInstance.isCreatorInSubreddit('t5_imagePro235', 'lotfy12')).toBe(false);
    });
  });
});


describe("testing delete friend of user service ", () => {
  describe("given the username and friend", () => {
    test("test that the function doesn't throw error", async () => {
      userServiceInstance.updateOne = jest.fn().mockImplementationOnce(() => { });
      expect(userServiceInstance.deleteFriend('t2_lotfy', 't2_nabil')).resolves.not.toThrowError();
    });
  });
});




describe("testing add friend of user service ", () => {
  describe("given the username and friend", () => {
    test("test that the function doesn't throw error", async () => {
      userServiceInstance.updateOne = jest.fn().mockImplementationOnce(() => { });
      expect(userServiceInstance.addFriend('t2_lotfy', 't2_nabil')).resolves.not.toThrowError();
    });
  });
});



describe("testing isModeratorInSubreddit in community service", () => {
  describe("given subreddit id and moderator", () => {
    let users = [
      User({
        _id: 'nabil123',
        moderators: [
          {
            communityId: 't5_imagePro235',
            role: 'creator'
          }
        ]
      }),
      User({
        _id: 'lotfy12',
        moderators: [
          {
            communityId: 't5_imagePro235',
            role: 'moderator'
          }
        ]
      }),
      User({
        _id: 'moaz12',
        moderators: [
          {
            communityId: 't5_tesla',
            role: 'moderator'
          }
        ]
      })
    ]
    test("test if the person is creator", async () => {
      userServiceInstance.getOne = jest.fn().mockReturnValueOnce(users[0]);
      expect(await userServiceInstance.isModeratorInSubreddit('t5_imagePro235', 'nabil123')).toBe(true);
      userServiceInstance.getOne = jest.fn().mockReturnValueOnce(users[1]);
      expect(await userServiceInstance.isModeratorInSubreddit('t5_imagePro235', 'lotfy12')).toBe(true);
      userServiceInstance.getOne = jest.fn().mockReturnValueOnce(users[2]);
      expect(await userServiceInstance.isModeratorInSubreddit('t5_imagePro235', 'moaz12')).toBe(false);
    });
  });
});



describe("testing addSubredditModeration of user service ", () => {
  describe("given the username and friend", () => {
    let users = [
      User({
        _id: 'nabil123',
        moderators: [
          {
            communityId: 't5_imagePro235',
            role: 'creator'
          }
        ]
      })
    ]
    test("test that the function doesn't throw error", async () => {
      User.prototype.save = jest.fn().mockImplementationOnce(() => { });
      expect(userServiceInstance.addSubredditModeration('t5_imagePro235', users[0])).resolves.not.toThrowError();
    });
  });
});


describe("testing isParticipantInSubreddit of user service ", () => {
  describe("given the username and subreddit", () => {
    let users = [
      User({
        _id: 'nabil123',
        member: [
          {
            communityId: 't5_imagePro235',
          }
        ]
      }),
      User({
        _id: 'moaz12',
        member: [
          {
            communityId: 't5_tesla',
          }
        ]
      })
    ]
    test("test that the function doesn't throw error", async () => {
      userServiceInstance.getOne = jest.fn().mockReturnValueOnce(users[0]);
      expect(await userServiceInstance.isParticipantInSubreddit('t5_imagePro235', 'nabil123')).toBe(true);
      userServiceInstance.getOne = jest.fn().mockReturnValueOnce(users[1]);
      expect(await userServiceInstance.isParticipantInSubreddit('t5_imagePro235', 'moaz12')).toBe(false);
    });
  });
});


describe("testing getFilteredSubreddits ", () => {
  describe("given subreddits", () => {
    let subreddits = [
      {
        communityId: 't5_imagePro235',
        isBanned: {
          value: false,
          date: Date.now()
        }
      },
      {
        communityId: 't5_tesla',
        isBanned: {
          value: true,
          date: Date.now()
        }
      },
      {
        communityId: 't5_cars',
        isBanned: {
          value: true,
          date: Date.now()
        }
      }
    ]
    test("test filter filter subreddits", async () => {
      expect(await userServiceInstance.getFilteredSubreddits(subreddits)[0]).toBe('t5_imagePro235');
    });
  });
});


describe("testing addUserFilter ", () => {
  describe("given username", () => {
    let user = {
      member: [
        {
          communityId: 't5_imagePro235',
          isBanned: {
            value: false,
            date: Date.now()
          }
        },
        {
          communityId: 't5_tesla',
          isBanned: {
            value: true,
            date: Date.now()
          }
        },
        {
          communityId: 't5_cars',
          isBanned: {
            value: true,
            date: Date.now()
          }
        }
      ],
      friend: ['lotfy', 'moaz'],
      follows: ['el3dawy'],
    }
    test("test filter subreddits", async () => {
      userServiceInstance.getOne = jest.fn().mockReturnValueOnce(user);
      expect(await userServiceInstance.addUserFilter('nabil')).toStrictEqual({
        $or: [
          {
            communityID: {
              $in: ['t5_imagePro235', undefined, undefined],
            },
          },
          {
            userID: {
              $in: ['lotfy', 'moaz'],
            },
          },
          {
            userID: {
              $in: ['el3dawy'],
            },
          },
        ],
      });
    });
  });
});


describe("testing getSearchResults ", () => {
  describe("given subreddits", () => {
    let subreddits = [
      {
        communityId: 't5_imagePro235',
        isBanned: {
          value: false,
          date: Date.now()
        }
      },
      {
        communityId: 't5_tesla',
        isBanned: {
          value: true,
          date: Date.now()
        }
      },
      {
        communityId: 't5_cars',
        isBanned: {
          value: true,
          date: Date.now()
        }
      }
    ]
    test("test filter filter subreddits", async () => {
      expect(await userServiceInstance.getFilteredSubreddits(subreddits)[0]).toBe('t5_imagePro235');
    });
  });
});


describe("testing resetPassword service in auth service class", () => {
  describe("given a username,currentPassword,newPassword, confirmedNewPassword", () => {
    test("should not throw an error", async () => {
      const user = new User({
        _id: "t2_moazMohamed",
        email: "moaz25jan2015@gmail.com",
      });
      bcrypt.compare=jest.fn().mockReturnValueOnce(true);
      userServiceInstance.getOne = jest.fn().mockReturnValueOnce(user);
      User.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        authServiceInstance.resetPassword(
          "user",
          "oldpass",
          "moaz42hassan",
          "moaz42hassan"
        )
      ).rejects.toThrowError();
    });
  });
  describe("given a currentPassword, newPassword, confirmedNewPassword, but invalid user", () => {
    test("should throw an error", async () => {
      userServiceInstance.getOne = jest.fn().mockReturnValueOnce(undefined);
      User.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        authServiceInstance.resetPassword(
          undefined,
          "oldpass",
          "moaz42hassan",
          "moaz42hassan"
        )
      ).rejects.toThrowError();
    });
  });
  describe("given a a username,currentPassword, newPassword, confirmedNewPassword!=newPassword", () => {
    test("should throw an error", async () => {
      const user = new User({
        _id: "t2_moazMohamed",
        email: "moaz25jan2015@gmail.com",
      });
      userServiceInstance.getOne = jest.fn().mockReturnValueOnce(user);
      User.prototype.save = jest.fn().mockImplementation(() => {});
      User.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        authServiceInstance.resetPassword(
          "user",
        "oldpass",
        "moaz42hassan",
        "moaz4assan"
        )
      ).rejects.toThrowError();
    });
  });
});

