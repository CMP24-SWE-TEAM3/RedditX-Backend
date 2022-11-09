const request = require("supertest");
const app = require("../app");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const dbConnect = require("../db-connection/connection");

/* Connecting to the database before each test. */
beforeAll(async () => {
  dbConnect();
});

describe("POST /r/t5_imagePro235/api/upload-sr-icon", () => {
  jest.setTimeout(1000000);
  let token =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFR5cGUiOiJiYXJlIGVtYWlsIiwidXNlcm5hbWUiOiJ0Ml9oYW1hZGEiLCJpYXQiOjE2NjgwMzUyNzMsImV4cCI6MTY2ODQ2NzI3M30.qVrkKurw9sRwSLt2V6xvBS7gBQC1PJ3abnga93wgR7M";

  describe("given an attachment (picture) and a valid token", () => {
    test("should respond with a 200 status code", async () => {
      const res = await request(app)
        .post("/r/t5_imagePro235/api/upload-sr-icon")
        .set("Authorization", token)
        .field("action", "upload")
        .attach("attachment", `${__dirname}/1.jpg`);
      expect(res.statusCode).toBe(200);
    });
    test("should respond with a body that have a field called message=Icon is updated successfully", async () => {
      const res = await request(app)
        .post("/r/t5_imagePro235/api/upload-sr-icon")
        .set("Authorization", token)
        .field("action", "upload")
        .attach("attachment", `${__dirname}/1.jpg`);
      expect(res.body.message).toBe("Icon is updated successfully");
    });
    test("should specify json in the content type header", async () => {
      const res = await request(app)
        .post("/r/t5_imagePro235/api/upload-sr-icon")
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
        .post("/r/t5_imagePro235/api/upload-sr-icon")
        .set("Authorization", token)
        .send({});
      expect(res.statusCode).toBe(500);
    });
  });
  describe("when token is invalid", () => {
    test("should respond with a 401 status code", async () => {
      token = "lkjkl";
      const res = await request(app)
        .post("/r/t5_imagePro235/api/upload-sr-icon")
        .set("Authorization", token)
        .field("action", "upload");
      expect(res.statusCode).toBe(401);
    });
  });
});

describe("POST /r/t5_imagePro235/api/upload-sr-banner", () => {
  jest.setTimeout(1000000);
  let token =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFR5cGUiOiJiYXJlIGVtYWlsIiwidXNlcm5hbWUiOiJ0Ml9oYW1hZGEiLCJpYXQiOjE2NjgwMzUyNzMsImV4cCI6MTY2ODQ2NzI3M30.qVrkKurw9sRwSLt2V6xvBS7gBQC1PJ3abnga93wgR7M";

  describe("given an attachment (picture) and a valid token", () => {
    test("should respond with a 200 status code", async () => {
      const res = await request(app)
        .post("/r/t5_imagePro235/api/upload-sr-banner")
        .set("Authorization", token)
        .field("action", "upload")
        .attach("attachment", `${__dirname}/1.jpg`);
      expect(res.statusCode).toBe(200);
    });
    test("should respond with a body that have a field called message=Banner is updated successfully", async () => {
      const res = await request(app)
        .post("/r/t5_imagePro235/api/upload-sr-banner")
        .set("Authorization", token)
        .field("action", "upload")
        .attach("attachment", `${__dirname}/1.jpg`);
      expect(res.body.message).toBe("Banner is updated successfully");
    });
    test("should specify json in the content type header", async () => {
      const res = await request(app)
        .post("/r/t5_imagePro235/api/upload-sr-banner")
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
        .post("/r/t5_imagePro235/api/upload-sr-banner")
        .set("Authorization", token)
        .send({});
      expect(res.statusCode).toBe(500);
    });
  });
  describe("when token is invalid", () => {
    test("should respond with a 401 status code", async () => {
      token = "lkjkl";
      const res = await request(app)
        .post("/r/t5_imagePro235/api/upload-sr-banner")
        .set("Authorization", token)
        .field("action", "upload");
      expect(res.statusCode).toBe(401);
    });
  });
});
