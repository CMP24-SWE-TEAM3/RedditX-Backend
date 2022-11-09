const request = require("supertest");
const app = require("../app");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const dbConnect = require("../db-connection/connection");

/* Connecting to the database before each test. */
beforeAll(async () => {
  dbConnect();
});

describe("POST /api/block-user", () => {
  jest.setTimeout(1000000);
  let token =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFR5cGUiOiJiYXJlIGVtYWlsIiwidXNlcm5hbWUiOiJ0Ml9oYW1hZGEiLCJpYXQiOjE2NjgwMzUyNzMsImV4cCI6MTY2ODQ2NzI3M30.qVrkKurw9sRwSLt2V6xvBS7gBQC1PJ3abnga93wgR7M";

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
    test("should respond with a body that have a field called message=Blocks are updated successfully", async () => {
      const res = await request(app)
        .post("/api/block-user")
        .set("Authorization", token)
        .send({
          userID: "t2_moazMohamed",
          action: true,
        });
      expect(res.body.message).toBe("Blocks are updated successfully");
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
  jest.setTimeout(1000000);
  let token =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFR5cGUiOiJiYXJlIGVtYWlsIiwidXNlcm5hbWUiOiJ0Ml9oYW1hZGEiLCJpYXQiOjE2NjgwMzUyNzMsImV4cCI6MTY2ODQ2NzI3M30.qVrkKurw9sRwSLt2V6xvBS7gBQC1PJ3abnga93wgR7M";

  describe("given an attachment (picture), action=upload, and a valid token", () => {
    test("should respond with a 200 status code", async () => {
      const res = await request(app)
        .post("/api/me/upload-user-photo")
        .set("Authorization", token)
        .field("action", "upload")
        .attach("attachment", `${__dirname}/1.jpg`);
      expect(res.statusCode).toBe(200);
    });
    test("should respond with a body that have a field called message=Avatar is updated successfully", async () => {
      const res = await request(app)
        .post("/api/me/upload-user-photo")
        .set("Authorization", token)
        .field("action", "upload")
        .attach("attachment", `${__dirname}/1.jpg`);
      expect(res.body.message).toBe("Avatar is updated successfully");
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
        .field("action", "upload");
      expect(res.statusCode).toBe(401);
    });
  });
});

describe("POST /api/spam", () => {
  jest.setTimeout(1000000);
  let token =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFR5cGUiOiJiYXJlIGVtYWlsIiwidXNlcm5hbWUiOiJ0Ml9oYW1hZGEiLCJpYXQiOjE2NjgwMzUyNzMsImV4cCI6MTY2ODQ2NzI3M30.qVrkKurw9sRwSLt2V6xvBS7gBQC1PJ3abnga93wgR7M";

  describe("given a linkID, spamText, spamType and a valid token", () => {
    test("should respond with a 200 status code", async () => {
      const res = await request(app)
        .post("/api/spam")
        .set("Authorization", token)
        .send({
          linkID: "t3_636a7e19a05b08800b06ad4e",
          spamText: "I found that this content is showing violence",
          spamType: "violent content",
        });
      expect(res.statusCode).toBe(200);
    });
    test("should respond with a body that have a field called message=Spams are updated successfully", async () => {
      const res = await request(app)
        .post("/api/spam")
        .set("Authorization", token)
        .send({
          linkID: "t3_636a7e19a05b08800b06ad4e",
          spamText: "I found that this content is showing violence",
          spamType: "violent content",
        });
      expect(res.body.message).toBe("Spams are updated successfully");
    });
    test("should specify json in the content type header", async () => {
      const res = await request(app)
        .post("/api/spam")
        .set("Authorization", token)
        .send({
          linkID: "t3_636a7e19a05b08800b06ad4e",
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
        .post("/api/spam")
        .set("Authorization", token)
        .send({});
      expect(res.statusCode).toBe(400);
    });
  });
  describe("when token is invalid", () => {
    test("should respond with a 401 status code", async () => {
      token = "lkjkl";
      const res = await request(app)
        .post("/api/spam")
        .set("Authorization", token)
        .send({
          linkID: "t3_636a7e19a05b08800b06ad4e",
          spamText: "I found that this content is showing violence",
          spamType: "violent content",
        });
      expect(res.statusCode).toBe(401);
    });
  });
});
