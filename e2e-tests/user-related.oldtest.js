/* eslint-disable */
const request = require("supertest");
const app = require("../app");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const dbConnect = require("../db-connection/connection");
const randomUsername = require("../utils/random-username");

/* Connecting to the database before each test. */
beforeAll(async () => {
  dbConnect();
});

const linkID = "t3_636f5494c56c8d6f0c159090";

describe("POST /api/user/block-user", () => {
  jest.setTimeout(1000000);
  let token =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFR5cGUiOiJiYXJlIGVtYWlsIiwidXNlcm5hbWUiOiJ0Ml9oYW1hZGEiLCJpYXQiOjE2NjgxNzExOTMsImV4cCI6MTY2ODYwMzE5M30.5La8KnuxWTb2u0neXtSWNr_9seVWam0tFEUjAwpqlC0";

  describe("given a userID, action=true(block), and a valid token", () => {
    test("should respond with a 200 status code", async () => {
      const res = await request(app)
        .post("/api/user/block-user")
        .set("Authorization", token)
        .send({
          userID: "t2_moazMohamed",
          action: true,
        });
      expect(res.statusCode).toBe(200);
    });
    test("should respond with a body that have a field called message=Blocks are updated successfully", async () => {
      const res = await request(app)
        .post("/api/user/block-user")
        .set("Authorization", token)
        .send({
          userID: "t2_moazMohamed",
          action: true,
        });
      expect(res.body.message).toBe("Blocks are updated successfully");
    });
    test("should specify json in the content type header", async () => {
      const res = await request(app)
        .post("/api/user/block-user")
        .set("Authorization", token)
        .send({
          userID: "t2_moazMohamed",
          action: true,
        });
      expect(res.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });
  describe("given a userID, action=false(unblock), and a valid token", () => {
    test("should respond with a 200 status code", async () => {
      const res = await request(app)
        .post("/api/user/block-user")
        .set("Authorization", token)
        .send({
          userID: "t2_moazMohamed",
          action: false,
        });
      expect(res.statusCode).toBe(200);
    });
    test("should specify json in the content type header", async () => {
      const res = await request(app)
        .post("/api/user/block-user")
        .set("Authorization", token)
        .send({
          userID: "t2_moazMohamed",
          action: false,
        });
      expect(res.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });
  describe("when the userID is missing", () => {
    test("should respond with a 400 status code", async () => {
      const res = await request(app)
        .post("/api/user/block-user")
        .set("Authorization", token)
        .send({});
      expect(res.statusCode).toBe(400);
    });
  });
  describe("when token is invalid", () => {
    test("should respond with a 401 status code", async () => {
      token = "lkjkl";
      const res = await request(app)
        .post("/api/user/block-user")
        .set("Authorization", token)
        .send({
          userID: "t2_moazMohamed",
          action: true,
        });
      expect(res.statusCode).toBe(401);
    });
  });
});

describe("POST /api/user/me/upload-user-photo", () => {
  jest.setTimeout(1000000);
  let token =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFR5cGUiOiJiYXJlIGVtYWlsIiwidXNlcm5hbWUiOiJ0Ml9oYW1hZGEiLCJpYXQiOjE2NjgxNzExOTMsImV4cCI6MTY2ODYwMzE5M30.5La8KnuxWTb2u0neXtSWNr_9seVWam0tFEUjAwpqlC0";

  describe("given an attachment (picture), action=upload, and a valid token", () => {
    test("should respond with a 200 status code", async () => {
      const res = await request(app)
        .post("/api/user/me/upload-user-photo")
        .set("Authorization", token)
        .field("action", "upload")
        .attach("attachment", `${__dirname}/1.jpg`);
      expect(res.statusCode).toBe(200);
    });
    test("should respond with a body that have a field called message=Avatar is updated successfully", async () => {
      const res = await request(app)
        .post("/api/user/me/upload-user-photo")
        .set("Authorization", token)
        .field("action", "upload")
        .attach("attachment", `${__dirname}/1.jpg`);
      expect(res.body.message).toBe("Avatar is updated successfully");
    });
    test("should specify json in the content type header", async () => {
      const res = await request(app)
        .post("/api/user/me/upload-user-photo")
        .set("Authorization", token)
        .field("action", "upload")
        .attach("attachment", `${__dirname}/1.jpg`);
      expect(res.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });
  describe("given an attachment (picture), action=delete, and a valid token", () => {
    test("should respond with a 200 status code", async () => {
      const res = await request(app)
        .post("/api/user/me/upload-user-photo")
        .set("Authorization", token)
        .field("action", "delete");
      expect(res.statusCode).toBe(200);
    });
    test("should specify json in the content type header", async () => {
      const res = await request(app)
        .post("/api/user/me/upload-user-photo")
        .set("Authorization", token)
        .field("action", "upload")
        .attach("attachment", `${__dirname}/1.jpg`);
      expect(res.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });
  describe("when the attachment is missing", () => {
    test("should respond with a 400 status code", async () => {
      const res = await request(app)
        .post("/api/user/me/upload-user-photo")
        .set("Authorization", token)
        .field("action", "upload");
      expect(res.statusCode).toBe(400);
    });
  });
  describe("when the action is missing", () => {
    test("should respond with a 400 status code", async () => {
      const res = await request(app)
        .post("/api/user/me/upload-user-photo")
        .set("Authorization", token)
        .attach("attachment", `${__dirname}/1.jpg`);
      expect(res.statusCode).toBe(400);
    });
  });
  describe("when token is invalid", () => {
    test("should respond with a 401 status code", async () => {
      token = "lkjkl";
      const res = await request(app)
        .post("/api/user/me/upload-user-photo")
        .set("Authorization", token)
        .field("action", "upload");
      expect(res.statusCode).toBe(401);
    });
  });
});

describe("POST /api/user/spam", () => {
  jest.setTimeout(1000000);
  let token =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFR5cGUiOiJiYXJlIGVtYWlsIiwidXNlcm5hbWUiOiJ0Ml9oYW1hZGEiLCJpYXQiOjE2NjgxNzExOTMsImV4cCI6MTY2ODYwMzE5M30.5La8KnuxWTb2u0neXtSWNr_9seVWam0tFEUjAwpqlC0";

  describe("given a linkID, spamText, spamType and a valid token", () => {
    test("should respond with a 200 status code", async () => {
      const res = await request(app)
        .post("/api/user/spam")
        .set("Authorization", token)
        .send({
          linkID,
          spamText: "I found that this content is showing violence",
          spamType: "violent content",
        });
      expect(res.statusCode).toBe(200);
    });
    test("should respond with a 200 status code", async () => {
      const res = await request(app)
        .post("/api/user/spam")
        .set("Authorization", token)
        .send({
          linkID: "t1_636a8816687a4fec0ac7c3fc",
          spamText: "I found that this content is showing violence",
          spamType: "violent content",
        });
      expect(res.statusCode).toBe(200);
    });
    test("should respond with a body that have a field called message=Spams are updated successfully", async () => {
      const res = await request(app)
        .post("/api/user/spam")
        .set("Authorization", token)
        .send({
          linkID,
          spamText: "I found that this content is showing violence",
          spamType: "violent content",
        });
      expect(res.body.message).toBe("Spams are updated successfully");
    });
    test("should specify json in the content type header", async () => {
      const res = await request(app)
        .post("/api/user/spam")
        .set("Authorization", token)
        .send({
          linkID,
          spamText: "I found that this content is showing violence",
          spamType: "violent content",
        });
      expect(res.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });
  describe("when the linkID is missing", () => {
    test("should respond with a 400 status code", async () => {
      const res = await request(app)
        .post("/api/user/spam")
        .set("Authorization", token)
        .send({});
      expect(res.statusCode).toBe(400);
    });
  });
  describe("when token is invalid", () => {
    test("should respond with a 401 status code", async () => {
      token = "lkjkl";
      const res = await request(app)
        .post("/api/user/spam")
        .set("Authorization", token)
        .send({
          linkID,
          spamText: "I found that this content is showing violence",
          spamType: "violent content",
        });
      expect(res.statusCode).toBe(401);
    });
  });
});

describe("User System", () => {
  let token =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFR5cGUiOiJiYXJlIGVtYWlsIiwidXNlcm5hbWUiOiJ0Ml9oYW1hZGEiLCJpYXQiOjE2NjgxNzExOTMsImV4cCI6MTY2ODYwMzE5M30.5La8KnuxWTb2u0neXtSWNr_9seVWam0tFEUjAwpqlC0";
  describe("test available username", () => {
    describe("username available", () => {
      test("should return 200 status code", async () => {
        const res = await request(app)
          .get(`/api/auth/username-available?username=t2_hen`)
          .set("Authorization", token);

        expect(res.statusCode).toBe(200);
      });
    });
    describe("username available", () => {
      test("should return 200 status code", async () => {
        const res = await request(app)
          .get(`/api/auth/username-available?username=t2_moazHassan`)
          .set("Authorization", token);

        expect(res.statusCode).toBe(404);
      });
    });
  });
  describe("test Signup", () => {
    describe("signup using Google account", () => {
      describe("valid signup using google account", () => {
        test("should respond with a 200 status code and data{token,username,expiresIn}", async () => {
          const res = await request(app)
            .post("/api/auth/signup")
            .set("Authorization", token)
            .send({
              googleOrFacebookToken:
                "eyJhbGciOiJSUzI1NiIsImtpZCI6ImQ3YjE5MTI0MGZjZmYzMDdkYzQ3NTg1OWEyYmUzNzgzZGMxYWY4OWYiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTW9oYW1lZCBpYnJhaGltIE1vdXNzYSBNdXN0YWZhIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FMbTV3dTBFT1ZPTzJlSjNNRDcwV3Q2ZVJDLThxLVd3eDU4VERrdWlXME1OPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3JlZGRpdC1jbG9uZS1hZDY2YyIsImF1ZCI6InJlZGRpdC1jbG9uZS1hZDY2YyIsImF1dGhfdGltZSI6MTY2Nzg0Nzg3MiwidXNlcl9pZCI6IkhrRzVTaG1pbUhUa0NRbWEzOXhjMkRxMU5ObDEiLCJzdWIiOiJIa0c1U2htaW1IVGtDUW1hMzl4YzJEcTFOTmwxIiwiaWF0IjoxNjY3ODQ3ODcyLCJleHAiOjE2Njc4NTE0NzIsImVtYWlsIjoibW9oYW1lZHJvbWVlMTJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTM4OTQ4NTY0MDAxMzIzODE4MTUiXSwiZW1haWwiOlsibW9oYW1lZHJvbWVlMTJAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.tU7Ky_qDckXM87BK6Lg6sxBC82gsKGzPZGTdS3g7kfnh4z-BGmUo50-eEBmuNokiuQBM1s0PazJWgLpxi9R5K8Znq0TXQu4S_BbqtndXwD7rhXC5IbfYiqW642XSW2r0t-hg1ioRCUCYAaIaAQVwtY_C_g9YuGSyNcBqXOCi3gSp9wo4KRumLHqNgrOdHFSTK5a5hVo0HW6UTtO4ccgi3ryN8CCyMyijKYnk_iWLqP-qS_4fxWuLcwqb95Z-snB64xLgv-gdNwxkgUlJ13ts4vd2PymqqckKhP-5kaQZo1u7agweGCRNppujjC4Mrm3pdpY66WkAB1TRfmh7XfUByQ",
              type: "gmail",
              password: "",
              username: "",
              email: "",
            });
          expect(res.statusCode).toBe(200);
          expect(res.body.expiresIn).toBe(3600);
          expect(res.body.username).toBe("gailey_35");
        });
      });
      describe("invalid signup using google account", () => {
        test("should respond with a 400 status code", async () => {
          const res = await request(app)
            .post("/api/auth/signup")
            .set("Authorization", token)
            .send({
              googleOrFacebookToken:
                "eyJhbGciOi.zalabia.JSUzI1NiIsImtpZCI6ImQ3YjE5MTI0MGZjZmYzMDdkYzQ3NTg1OWEyYmUzNzgzZGMxYWY4OWYiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTW9oYW1lZCBpYnJhaGltIE1vdXNzYSBNdXN0YWZhIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FMbTV3dTBFT1ZPTzJlSjNNRDcwV3Q2ZVJDLThxLVd3eDU4VERrdWlXME1OPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3JlZGRpdC1jbG9uZS1hZDY2YyIsImF1ZCI6InJlZGRpdC1jbG9uZS1hZDY2YyIsImF1dGhfdGltZSI6MTY2Nzg0Nzg3MiwidXNlcl9pZCI6IkhrRzVTaG1pbUhUa0NRbWEzOXhjMkRxMU5ObDEiLCJzdWIiOiJIa0c1U2htaW1IVGtDUW1hMzl4YzJEcTFOTmwxIiwiaWF0IjoxNjY3ODQ3ODcyLCJleHAiOjE2Njc4NTE0NzIsImVtYWlsIjoibW9oYW1lZHJvbWVlMTJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTM4OTQ4NTY0MDAxMzIzODE4MTUiXSwiZW1haWwiOlsibW9oYW1lZHJvbWVlMTJAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.tU7Ky_qDckXM87BK6Lg6sxBC82gsKGzPZGTdS3g7kfnh4z-BGmUo50-eEBmuNokiuQBM1s0PazJWgLpxi9R5K8Znq0TXQu4S_BbqtndXwD7rhXC5IbfYiqW642XSW2r0t-hg1ioRCUCYAaIaAQVwtY_C_g9YuGSyNcBqXOCi3gSp9wo4KRumLHqNgrOdHFSTK5a5hVo0HW6UTtO4ccgi3ryN8CCyMyijKYnk_iWLqP-qS_4fxWuLcwqb95Z-snB64xLgv-gdNwxkgUlJ13ts4vd2PymqqckKhP-5kaQZo1u7agweGCRNppujjC4Mrm3pdpY66WkAB1TRfmh7XfUByQ",
              type: "gmail",
              password: "",
              username: "",
              email: "",
            });
          expect(res.statusCode).toBe(400);
        });
      });
    });
    describe("signup using Facebook account", () => {
      describe("valid signup using facebook account", () => {
        test("should respond with a 200 status code and data{token,username,expiresIn}", async () => {
          const res = await request(app)
            .post("/api/auth/signup")
            .set("Authorization", token)
            .send({
              googleOrFacebookToken:
                "eyJhbGciOiJSUzI1NiIsImtpZCI6ImQ3YjE5MTI0MGZjZmYzMDdkYzQ3NTg1OWEyYmUzNzgzZGMxYWY4OWYiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTW9oYW1lZCBJYnJhaGltIiwicGljdHVyZSI6Imh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLzU1NDg1NjQ1NTUyNDI4MDYvcGljdHVyZSIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9yZWRkaXQtY2xvbmUtYWQ2NmMiLCJhdWQiOiJyZWRkaXQtY2xvbmUtYWQ2NmMiLCJhdXRoX3RpbWUiOjE2Njc4NTI2MDUsInVzZXJfaWQiOiI1SXYwcTZ5RnptVnd4M291eXNkenVoN3U3NzgyIiwic3ViIjoiNUl2MHE2eUZ6bVZ3eDNvdXlzZHp1aDd1Nzc4MiIsImlhdCI6MTY2Nzg1MjYwNSwiZXhwIjoxNjY3ODU2MjA1LCJlbWFpbCI6Im1vZGVpYnJhaGltXzIwMDFAaG90bWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZmFjZWJvb2suY29tIjpbIjU1NDg1NjQ1NTUyNDI4MDYiXSwiZW1haWwiOlsibW9kZWlicmFoaW1fMjAwMUBob3RtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6ImZhY2Vib29rLmNvbSJ9fQ.CX8TvYlyp1usf83GSMQcAARh3oWsdXdRK_TjuokxtZcZ19p-PUZzMDj1zzJAFfvWZ6eSfUxYEFvTosbv-MJIMFBm8swvdGnSumP_lbaOK-AM_FWkmiQHF5t0o4Y6CZ--gj3t628t3GXpJBKWdh1pwowuHZw0ST1LXuFeo492-wyYv5zBCijXZdMdMqsxiKu7bMqTYyKv4mKeDkx4A5QS6rXZfI7j1Lm4SYq1jkRsVU7dTG8efKREx7nAVjKG6Fisc1Ftwy4x9cDXyMmmReL9Dh_8TQ1YmR-lbSVRqacpmPPanJeCEG6w2vSZdM7PnZIluO8zmvGMIYhFlEIxsY1k4g",
              type: "facebook",
              password: "",
              username: "",
              email: "",
            });
          expect(res.statusCode).toBe(200);
          expect(res.body.expiresIn).toBe(3600);
          expect(res.body.username).toBe("cimbri_134");
        });
      });
      describe("invalid signup using facebook account", () => {
        test("should respond with a 400 status code", async () => {
          const res = await request(app)
            .post("/api/auth/signup")
            .set("Authorization", token)
            .send({
              googleOrFacebookToken:
                "eyJhbGciOi.zalabia.JSUzI1NiIsImtpZCI6ImQ3YjE5MTI0MGZjZmYzMDdkYzQ3NTg1OWEyYmUzNzgzZGMxYWY4OWYiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTW9oYW1lZCBpYnJhaGltIE1vdXNzYSBNdXN0YWZhIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FMbTV3dTBFT1ZPTzJlSjNNRDcwV3Q2ZVJDLThxLVd3eDU4VERrdWlXME1OPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3JlZGRpdC1jbG9uZS1hZDY2YyIsImF1ZCI6InJlZGRpdC1jbG9uZS1hZDY2YyIsImF1dGhfdGltZSI6MTY2Nzg0Nzg3MiwidXNlcl9pZCI6IkhrRzVTaG1pbUhUa0NRbWEzOXhjMkRxMU5ObDEiLCJzdWIiOiJIa0c1U2htaW1IVGtDUW1hMzl4YzJEcTFOTmwxIiwiaWF0IjoxNjY3ODQ3ODcyLCJleHAiOjE2Njc4NTE0NzIsImVtYWlsIjoibW9oYW1lZHJvbWVlMTJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTM4OTQ4NTY0MDAxMzIzODE4MTUiXSwiZW1haWwiOlsibW9oYW1lZHJvbWVlMTJAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.tU7Ky_qDckXM87BK6Lg6sxBC82gsKGzPZGTdS3g7kfnh4z-BGmUo50-eEBmuNokiuQBM1s0PazJWgLpxi9R5K8Znq0TXQu4S_BbqtndXwD7rhXC5IbfYiqW642XSW2r0t-hg1ioRCUCYAaIaAQVwtY_C_g9YuGSyNcBqXOCi3gSp9wo4KRumLHqNgrOdHFSTK5a5hVo0HW6UTtO4ccgi3ryN8CCyMyijKYnk_iWLqP-qS_4fxWuLcwqb95Z-snB64xLgv-gdNwxkgUlJ13ts4vd2PymqqckKhP-5kaQZo1u7agweGCRNppujjC4Mrm3pdpY66WkAB1TRfmh7XfUByQ",
              type: "facebook",
              password: "",
              username: "",
              email: "",
            });
          expect(res.statusCode).toBe(400);
        });
      });
    });

    describe("signup using bare email", () => {
      describe("valid signup using bare email", () => {
        test("should respond with a 200 status code and data{token,username,expiresIn}", async () => {
          const username = randomUsername.randomUserName();
          const res = await request(app)
            .post("/api/auth/signup")
            .set("Authorization", token)
            .send({
              googleOrFacebookToken: "",
              type: "bare email",
              password: "lotfy",
              username: `${username}`,
              email: `${username}@gmail.com`,
            });
          expect(res.statusCode).toBe(200);
          expect(res.body.expiresIn).toBe(3600);
          expect(res.body.username).toBe(username);
        });
      });
      describe("invalid signup using bare email", () => {
        test("should respond with a 400 status code", async () => {
          const res = await request(app)
            .post("/api/auth/signup")
            .set("Authorization", token)
            .send({
              googleOrFacebookToken: "",
              type: "bare email",
              password: "lotfy",
              username: "ahmed231",
              email: "ahmed231@gmail.com",
            });
          expect(res.statusCode).toBe(400);
          expect(res.body.error).toBe("Duplicate email!");
        });
      });
    });
  });
  describe("test login", () => {
    describe("login using Google account", () => {
      describe("valid login using existing google account", () => {
        test("should respond with a 200 status code and data{token,username,expiresIn}", async () => {
          const res = await request(app)
            .post("/api/auth/login")
            .set("Authorization", token)
            .send({
              googleOrFacebookToken:
                "eyJhbGciOiJSUzI1NiIsImtpZCI6ImQ3YjE5MTI0MGZjZmYzMDdkYzQ3NTg1OWEyYmUzNzgzZGMxYWY4OWYiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTW9oYW1lZCBpYnJhaGltIE1vdXNzYSBNdXN0YWZhIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FMbTV3dTBFT1ZPTzJlSjNNRDcwV3Q2ZVJDLThxLVd3eDU4VERrdWlXME1OPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3JlZGRpdC1jbG9uZS1hZDY2YyIsImF1ZCI6InJlZGRpdC1jbG9uZS1hZDY2YyIsImF1dGhfdGltZSI6MTY2Nzg0Nzg3MiwidXNlcl9pZCI6IkhrRzVTaG1pbUhUa0NRbWEzOXhjMkRxMU5ObDEiLCJzdWIiOiJIa0c1U2htaW1IVGtDUW1hMzl4YzJEcTFOTmwxIiwiaWF0IjoxNjY3ODQ3ODcyLCJleHAiOjE2Njc4NTE0NzIsImVtYWlsIjoibW9oYW1lZHJvbWVlMTJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTM4OTQ4NTY0MDAxMzIzODE4MTUiXSwiZW1haWwiOlsibW9oYW1lZHJvbWVlMTJAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.tU7Ky_qDckXM87BK6Lg6sxBC82gsKGzPZGTdS3g7kfnh4z-BGmUo50-eEBmuNokiuQBM1s0PazJWgLpxi9R5K8Znq0TXQu4S_BbqtndXwD7rhXC5IbfYiqW642XSW2r0t-hg1ioRCUCYAaIaAQVwtY_C_g9YuGSyNcBqXOCi3gSp9wo4KRumLHqNgrOdHFSTK5a5hVo0HW6UTtO4ccgi3ryN8CCyMyijKYnk_iWLqP-qS_4fxWuLcwqb95Z-snB64xLgv-gdNwxkgUlJ13ts4vd2PymqqckKhP-5kaQZo1u7agweGCRNppujjC4Mrm3pdpY66WkAB1TRfmh7XfUByQ",
              type: "gmail",
              password: "",
              username: "",
              email: "",
            });
          expect(res.statusCode).toBe(200);
          expect(res.body.expiresIn).toBe(3600);
          expect(res.body.username).toBe("gailey_35");
        });
      });
      describe("invalid login using google account", () => {
        test("should respond with a 404 status code", async () => {
          const res = await request(app)
            .post("/api/auth/login")
            .set("Authorization", token)
            .send({
              googleOrFacebookToken:
                "eyJhbGciOiJSUzI1.zalabia.NiIsImtpZCI6ImQ3YjE5MTI0MGZjZmYzMDdkYzQ3NTg1OWEyYmUzNzgzZGMxYWY4OWYiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTW9oYW1lZCBpYnJhaGltIE1vdXNzYSBNdXN0YWZhIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FMbTV3dTBFT1ZPTzJlSjNNRDcwV3Q2ZVJDLThxLVd3eDU4VERrdWlXME1OPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3JlZGRpdC1jbG9uZS1hZDY2YyIsImF1ZCI6InJlZGRpdC1jbG9uZS1hZDY2YyIsImF1dGhfdGltZSI6MTY2Nzg0Nzg3MiwidXNlcl9pZCI6IkhrRzVTaG1pbUhUa0NRbWEzOXhjMkRxMU5ObDEiLCJzdWIiOiJIa0c1U2htaW1IVGtDUW1hMzl4YzJEcTFOTmwxIiwiaWF0IjoxNjY3ODQ3ODcyLCJleHAiOjE2Njc4NTE0NzIsImVtYWlsIjoibW9oYW1lZHJvbWVlMTJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTM4OTQ4NTY0MDAxMzIzODE4MTUiXSwiZW1haWwiOlsibW9oYW1lZHJvbWVlMTJAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.tU7Ky_qDckXM87BK6Lg6sxBC82gsKGzPZGTdS3g7kfnh4z-BGmUo50-eEBmuNokiuQBM1s0PazJWgLpxi9R5K8Znq0TXQu4S_BbqtndXwD7rhXC5IbfYiqW642XSW2r0t-hg1ioRCUCYAaIaAQVwtY_C_g9YuGSyNcBqXOCi3gSp9wo4KRumLHqNgrOdHFSTK5a5hVo0HW6UTtO4ccgi3ryN8CCyMyijKYnk_iWLqP-qS_4fxWuLcwqb95Z-snB64xLgv-gdNwxkgUlJ13ts4vd2PymqqckKhP-5kaQZo1u7agweGCRNppujjC4Mrm3pdpY66WkAB1TRfmh7XfUByQ",
              type: "gmail",
              password: "",
              username: "",
              email: "",
            });
          expect(res.statusCode).toBe(404);
        });
      });
    });
    describe("login using Facebook account", () => {
      describe("valid login using existing facebook account if not account will be created", () => {
        test("should respond with a 200 status code and data{token,username,expiresIn}", async () => {
          const res = await request(app)
            .post("/api/auth/login")
            .set("Authorization", token)
            .send({
              googleOrFacebookToken:
                "eyJhbGciOiJSUzI1NiIsImtpZCI6ImQ3YjE5MTI0MGZjZmYzMDdkYzQ3NTg1OWEyYmUzNzgzZGMxYWY4OWYiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTW9oYW1lZCBJYnJhaGltIiwicGljdHVyZSI6Imh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLzU1NDg1NjQ1NTUyNDI4MDYvcGljdHVyZSIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9yZWRkaXQtY2xvbmUtYWQ2NmMiLCJhdWQiOiJyZWRkaXQtY2xvbmUtYWQ2NmMiLCJhdXRoX3RpbWUiOjE2Njc4NTI2MDUsInVzZXJfaWQiOiI1SXYwcTZ5RnptVnd4M291eXNkenVoN3U3NzgyIiwic3ViIjoiNUl2MHE2eUZ6bVZ3eDNvdXlzZHp1aDd1Nzc4MiIsImlhdCI6MTY2Nzg1MjYwNSwiZXhwIjoxNjY3ODU2MjA1LCJlbWFpbCI6Im1vZGVpYnJhaGltXzIwMDFAaG90bWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZmFjZWJvb2suY29tIjpbIjU1NDg1NjQ1NTUyNDI4MDYiXSwiZW1haWwiOlsibW9kZWlicmFoaW1fMjAwMUBob3RtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6ImZhY2Vib29rLmNvbSJ9fQ.CX8TvYlyp1usf83GSMQcAARh3oWsdXdRK_TjuokxtZcZ19p-PUZzMDj1zzJAFfvWZ6eSfUxYEFvTosbv-MJIMFBm8swvdGnSumP_lbaOK-AM_FWkmiQHF5t0o4Y6CZ--gj3t628t3GXpJBKWdh1pwowuHZw0ST1LXuFeo492-wyYv5zBCijXZdMdMqsxiKu7bMqTYyKv4mKeDkx4A5QS6rXZfI7j1Lm4SYq1jkRsVU7dTG8efKREx7nAVjKG6Fisc1Ftwy4x9cDXyMmmReL9Dh_8TQ1YmR-lbSVRqacpmPPanJeCEG6w2vSZdM7PnZIluO8zmvGMIYhFlEIxsY1k4g",
              type: "facebook",
              password: "",
              username: "",
              email: "",
            });
          expect(res.statusCode).toBe(200);
          expect(res.body.expiresIn).toBe(3600);
          expect(res.body.username).toBe("cimbri_134");
        });
      });
      describe("invalid login using facebook account", () => {
        test("should respond with a 404 status code", async () => {
          const res = await request(app)
            .post("/api/auth/login")
            .set("Authorization", token)
            .send({
              googleOrFacebookToken:
                "eyJhbGciOiJSUzI1.zalabia.NiIsImtpZCI6ImQ3YjE5MTI0MGZjZmYzMDdkYzQ3NTg1OWEyYmUzNzgzZGMxYWY4OWYiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTW9oYW1lZCBpYnJhaGltIE1vdXNzYSBNdXN0YWZhIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FMbTV3dTBFT1ZPTzJlSjNNRDcwV3Q2ZVJDLThxLVd3eDU4VERrdWlXME1OPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3JlZGRpdC1jbG9uZS1hZDY2YyIsImF1ZCI6InJlZGRpdC1jbG9uZS1hZDY2YyIsImF1dGhfdGltZSI6MTY2Nzg0Nzg3MiwidXNlcl9pZCI6IkhrRzVTaG1pbUhUa0NRbWEzOXhjMkRxMU5ObDEiLCJzdWIiOiJIa0c1U2htaW1IVGtDUW1hMzl4YzJEcTFOTmwxIiwiaWF0IjoxNjY3ODQ3ODcyLCJleHAiOjE2Njc4NTE0NzIsImVtYWlsIjoibW9oYW1lZHJvbWVlMTJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTM4OTQ4NTY0MDAxMzIzODE4MTUiXSwiZW1haWwiOlsibW9oYW1lZHJvbWVlMTJAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.tU7Ky_qDckXM87BK6Lg6sxBC82gsKGzPZGTdS3g7kfnh4z-BGmUo50-eEBmuNokiuQBM1s0PazJWgLpxi9R5K8Znq0TXQu4S_BbqtndXwD7rhXC5IbfYiqW642XSW2r0t-hg1ioRCUCYAaIaAQVwtY_C_g9YuGSyNcBqXOCi3gSp9wo4KRumLHqNgrOdHFSTK5a5hVo0HW6UTtO4ccgi3ryN8CCyMyijKYnk_iWLqP-qS_4fxWuLcwqb95Z-snB64xLgv-gdNwxkgUlJ13ts4vd2PymqqckKhP-5kaQZo1u7agweGCRNppujjC4Mrm3pdpY66WkAB1TRfmh7XfUByQ",
              type: "facebook",
              password: "",
              username: "",
              email: "",
            });
          expect(res.statusCode).toBe(404);
        });
      });
    });

    describe("login using bare email", () => {
      describe("valid login using bare email", () => {
        test("should respond with a 200 status code and data{token,username,expiresIn}", async () => {
          const res = await request(app)
            .post("/api/auth/login")
            .set("Authorization", token)
            .send({
              googleOrFacebookToken: "",
              type: "bare email",
              password: "lotfy",
              username: "ahmed231",
              email: "",
            });
          expect(res.statusCode).toBe(200);
          expect(res.body.expiresIn).toBe(3600);
          expect(res.body.username).toBe("ahmed231");
        });
      });
      // describe("invalid login using bare email and invalid username",()=>{
      //   test("should respond with a 404 status code", async () => {
      //         const res = await request(app)
      //           .post("/api/auth/login")
      //           .set("Authorization", token)
      //           .send({
      //             "googleOrFacebookToken":"",
      //             "type":"bare email",
      //             "password":"lotfy",
      //             "username":"ahmed2311zal12",
      //             "email":"tes@gmail.com"
      //           })
      //         expect(res.statusCode).toBe(404);
      //   });

      // });
      describe("invalid login using bare email and invalid password", () => {
        test("should respond with a 400 status code", async () => {
          const res = await request(app)
            .post("/api/auth/login")
            .set("Authorization", token)
            .send({
              googleOrFacebookToken: "",
              type: "bare email",
              password: "lotfy2",
              username: "ahmed231",
              email: "",
            });
          expect(res.statusCode).toBe(404);
        });
      });
    });
  });
});
describe("test random username func", () => {
  test("should return username of length >2", async () => {
    const username = randomUsername.randomUserName();
    expect(username.length).toBeGreaterThan(2);
  });
});
