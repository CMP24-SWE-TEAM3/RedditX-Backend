/* eslint-disable */
const User = require("../models/user-model");
const UserService = require("../services/user-service");
const AuthService = require("../services/auth-service");
const Email = require("./../utils/email");
const bcrypt = require("bcryptjs");
const userServiceInstance = new UserService(User);
const authServiceInstance = new AuthService(User);
jest.setTimeout(1000000);
describe("testing uploadUserPhoto service in user service class", () => {
  describe("given a data with action=upload, username, and a file", () => {
    test("should not throw an error", async () => {
      userServiceInstance.findByIdAndUpdate = jest
        .fn()
        .mockImplementationOnce(() => {});
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
