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

describe("POST /api/block-user", () => {
  let token =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFR5cGUiOiJiYXJlIGVtYWlsIiwidXNlcm5hbWUiOiJ0Ml9oYW1hZGEiLCJpYXQiOjE2Njc5NTQzOTMsImV4cCI6MTY2Nzk1Nzk5M30.-KbGLRgSTOC7gdCunSICU0NsbrlOTie98JgKn_tjs-I";

  describe("given a userID, action=true(block), and a valid token", () => {
    test("should respond with a 200 status code", async () => {
      const res = await request(app)
        .post("/api/block-user")
        .set("Authorization", token)
        .send({
          userID: "t2_moazMohamed",
          action: true,
        });
      expect(res.statusCode).toBe(200);
    });
    test("should specify json in the content type header", async () => {
      const res = await request(app)
        .post("/api/block-user")
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
        .post("/api/block-user")
        .set("Authorization", token)
        .send({
          userID: "t2_moazMohamed",
          action: false,
        });
      expect(res.statusCode).toBe(200);
    });
    test("should specify json in the content type header", async () => {
      const res = await request(app)
        .post("/api/block-user")
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
        .post("/api/block-user")
        .set("Authorization", token)
        .send({});
      expect(res.statusCode).toBe(400);
    });
  });
  describe("when token is invalid", () => {
    test("should respond with a 401 status code", async () => {
      token = "lkjkl";
      const res = await request(app)
        .post("/api/block-user")
        .set("Authorization", token)
        .send({
          userID: "t2_moazMohamed",
          action: true,
        });
      expect(res.statusCode).toBe(401);
    });
  });
});

describe("POST /api/me/upload-user-photo", () => {
  let token =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFR5cGUiOiJiYXJlIGVtYWlsIiwidXNlcm5hbWUiOiJ0Ml9oYW1hZGEiLCJpYXQiOjE2Njc5NTQzOTMsImV4cCI6MTY2Nzk1Nzk5M30.-KbGLRgSTOC7gdCunSICU0NsbrlOTie98JgKn_tjs-I";

  describe("given an attachment (picture), action=upload, and a valid token", () => {
    test("should respond with a 200 status code", async () => {
      const res = await request(app)
        .post("/api/me/upload-user-photo")
        .set("Authorization", token)
        .field("action", "upload")
        .attach("attachment", `${__dirname}/1.jpg`);
      expect(res.statusCode).toBe(200);
    });
    test("should specify json in the content type header", async () => {
      const res = await request(app)
        .post("/api/me/upload-user-photo")
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
        .post("/api/me/upload-user-photo")
        .set("Authorization", token)
        .field("action", "delete");
      expect(res.statusCode).toBe(200);
    });
    test("should specify json in the content type header", async () => {
      const res = await request(app)
        .post("/api/me/upload-user-photo")
        .set("Authorization", token)
        .field("action", "upload")
        .attach("attachment", `${__dirname}/1.jpg`);
      expect(res.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });
  describe("when the attachment is missing", () => {
    test("should respond with a 500 status code", async () => {
      const res = await request(app)
        .post("/api/me/upload-user-photo")
        .set("Authorization", token)
        .field("action", "upload");
      expect(res.statusCode).toBe(500);
    });
  });
  describe("when the action is missing", () => {
    test("should respond with a 500 status code", async () => {
      const res = await request(app)
        .post("/api/me/upload-user-photo")
        .set("Authorization", token)
        .attach("attachment", `${__dirname}/1.jpg`);
      expect(res.statusCode).toBe(500);
    });
  });
  describe("when token is invalid", () => {
    test("should respond with a 401 status code", async () => {
      token = "lkjkl";
      const res = await request(app)
        .post("/api/me/upload-user-photo")
        .set("Authorization", token)
        .field("action", "upload")
        .attach("attachment", `${__dirname}/1.jpg`);
      expect(res.statusCode).toBe(401);
    });
  });
});
