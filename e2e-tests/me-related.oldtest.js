/* eslint-disable */
const request = require("supertest");
const app = require("../app");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const dbConnect = require("../db-connection/connection");

/* Connecting to the database before each test. */
beforeAll(async () => {
  dbConnect();
});
jest.setTimeout(1000000);
describe("User System", () => {
  describe("test username about ", () => {
    describe("username about", () => {
      const username = "t2_hamada";
      test("should respond with 200 status code", async () => {
        const res = await request(app).get(`/api/user/${username}/about`);
        expect(res.statusCode).toBe(200);
      });
    });
    describe("username about", () => {
      const username = "t2_hamada";
      test("should specify json in the content type header", async () => {
        const res = await request(app).get(`/api/user/${username}/about`);
        expect(res.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
      });
    });
    describe("username about", () => {
      const username = "t2_hamada";
      test("should respond with a body that have a field called isBlocked to be equal false", async () => {
        const res = await request(app).get(`/api/user/${username}/about`);
        expect(res.body.data.isBlocked).toBe(false);
      });
    });
    describe("username about", () => {
      const username = "t2_hamd";
      test("should respond with 404 status code", async () => {
        const res = await request(app).get(`/api/user/${username}/about`);
        expect(res.statusCode).toBe(404);
      });
    });
  });
});

describe("User System", () => {
  let token =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFR5cGUiOiJiYXJlIGVtYWlsIiwidXNlcm5hbWUiOiJ0Ml9oYW1hZGEiLCJpYXQiOjE2NjgxNzExOTMsImV4cCI6MTY2ODYwMzE5M30.5La8KnuxWTb2u0neXtSWNr_9seVWam0tFEUjAwpqlC0";
  describe("test username me info ", () => {
    describe("username me info", () => {
      test("should respond with 200 status code", async () => {
        const res = await request(app)
          .get(`/api/user/me`)
          .set("Authorization", token);
        expect(res.statusCode).toBe(200);
      });
    });
    describe("username me info", () => {
      test("should specify json in the content type header", async () => {
        const res = await request(app)
          .get(`/api/user/me`)
          .set("Authorization", token);
        expect(res.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
      });
    });
    describe("username me info", () => {
      test("should respond with a body that have a field called emailCommentReply to be equal true", async () => {
        const res = await request(app)
          .get(`/api/user/me`)
          .set("Authorization", token);
        expect(res.body.data.emailCommentReply).toBe(true);
      });
    });
    describe("given invalid token", () => {
      test("should respond with 401 status code", async () => {
        token = "crfccrf";
        const res = await request(app)
          .get(`/api/user/me`)
          .set("Authorization", token);
        expect(res.statusCode).toBe(401);
      });
    });
  });
});

describe("User System", () => {
  let token =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFR5cGUiOiJiYXJlIGVtYWlsIiwidXNlcm5hbWUiOiJ0Ml9oYW1hZGEiLCJpYXQiOjE2NjgxNzExOTMsImV4cCI6MTY2ODYwMzE5M30.5La8KnuxWTb2u0neXtSWNr_9seVWam0tFEUjAwpqlC0";
  describe("test username prefs", () => {
    describe("username prefs", () => {
      test("should respond with 200 status code", async () => {
        const res = await request(app)
          .get(`/api/user/me/prefs`)
          .set("Authorization", token);
        expect(res.statusCode).toBe(200);
      });
    });
    describe("username prefs", () => {
      test("should specify json in the content type header", async () => {
        const res = await request(app)
          .get(`/api/user/me/prefs`)
          .set("Authorization", token);
        expect(res.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
      });
    });
    describe("username prefs", () => {
      test("should respond with a body that have a field called emailPrivateMessage to be equal true", async () => {
        const res = await request(app)
          .get(`/api/user/me/prefs`)
          .set("Authorization", token);
        expect(res.body.data.emailPrivateMessage).toBe(true);
      });
    });
    describe("given invalid token", () => {
      test("should respond with 401 status code", async () => {
        token = "crfcr";
        const res = await request(app)
          .get(`/api/user/me/prefs`)
          .set("Authorization", token);
        expect(res.statusCode).toBe(401);
      });
    });
  });
});
