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

describe("POST /r/t5_imagePro235/api/upload-sr-icon", () => {
  let token =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFR5cGUiOiJiYXJlIGVtYWlsIiwidXNlcm5hbWUiOiJ0Ml9oYW1hZGEiLCJpYXQiOjE2Njc5NDQ5OTcsImV4cCI6MTY2Nzk0ODU5N30.JdaVN9dccn_0wOWiSfWB8IJEVm7h-KXZikphw_27Wv0";

  describe("given an attachment (picture) and a valid token", () => {
    test("should respond with a 200 status code", async () => {
      const res = await request(app)
        .post("/r/t5_imagePro235/api/upload-sr-icon")
        .set("Authorization", token)
        .field("action", "upload")
        .attach("attachment", `${__dirname}/1.jpg`);
      expect(res.statusCode).toBe(200);
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
        .field("action", "upload")
        .attach("attachment", `${__dirname}/1.jpg`);
      expect(res.statusCode).toBe(401);
    });
  });
});

describe("POST /r/t5_imagePro235/api/upload-sr-banner", () => {
  let token =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFR5cGUiOiJiYXJlIGVtYWlsIiwidXNlcm5hbWUiOiJ0Ml9oYW1hZGEiLCJpYXQiOjE2Njc5NDQ5OTcsImV4cCI6MTY2Nzk0ODU5N30.JdaVN9dccn_0wOWiSfWB8IJEVm7h-KXZikphw_27Wv0";

  describe("given an attachment (picture) and a valid token", () => {
    test("should respond with a 200 status code", async () => {
      const res = await request(app)
        .post("/r/t5_imagePro235/api/upload-sr-banner")
        .set("Authorization", token)
        .field("action", "upload")
        .attach("attachment", `${__dirname}/1.jpg`);
      expect(res.statusCode).toBe(200);
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
        .field("action", "upload")
        .attach("attachment", `${__dirname}/1.jpg`);
      expect(res.statusCode).toBe(401);
    });
  });
});