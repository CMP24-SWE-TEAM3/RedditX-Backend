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

describe("POST /api/submit", () => {
  let token =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFR5cGUiOiJiYXJlIGVtYWlsIiwidXNlcm5hbWUiOiJ0Ml9oYW1hZGEiLCJpYXQiOjE2Njc5NTQzOTMsImV4cCI6MTY2Nzk1Nzk5M30.-KbGLRgSTOC7gdCunSICU0NsbrlOTie98JgKn_tjs-I";

  describe("given a text, title, attachment (file) and a valid token", () => {
    test("should respond with a 201 status code", async () => {
      const res = await request(app)
        .post("/api/submit")
        .set("Authorization", token)
        .field(
          "text",
          "This is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post text"
        )
        .field("title", "This is a post title")
        .attach("attachments", `${__dirname}/1.jpg`);
      expect(res.statusCode).toBe(201);
    });
    test("should specify json in the content type header", async () => {
      const res = await request(app)
        .post("/api/submit")
        .set("Authorization", token)
        .field(
          "text",
          "This is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post text"
        )
        .field("title", "This is a post title")
        .attach("attachments", `${__dirname}/1.jpg`);
      expect(res.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });
  describe("when the title or text are missing", () => {
    test("should respond with a 400 status code", async () => {
      const res = await request(app)
        .post("/api/submit")
        .set("Authorization", token)
        .send({
          title: "This is a post title",
        });
      expect(res.statusCode).toBe(400);
    });
  });
  describe("when token is invalid", () => {
    test("should respond with a 401 status code", async () => {
      token = "lkjkl";
      const res = await request(app)
        .post("/api/submit")
        .set("Authorization", token)
        .send({
          text: "This is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post text",
          title: "This is a post title",
        });
      expect(res.statusCode).toBe(401);
    });
  });
});

describe("POST /api/save", () => {
  let token =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFR5cGUiOiJiYXJlIGVtYWlsIiwidXNlcm5hbWUiOiJ0Ml9oYW1hZGEiLCJpYXQiOjE2Njc5NTQzOTMsImV4cCI6MTY2Nzk1Nzk5M30.-KbGLRgSTOC7gdCunSICU0NsbrlOTie98JgKn_tjs-I";

  describe("given a linkID and a valid token", () => {
    test("should respond with a 200 status code", async () => {
      const res = await request(app)
        .post("/api/save")
        .set("Authorization", token)
        .send({
          linkID: "t3_636a7e19a05b08800b06ad4e",
        });
      expect(res.statusCode).toBe(200);
    });
    test("should specify json in the content type header", async () => {
      const res = await request(app)
        .post("/api/save")
        .set("Authorization", token)
        .send({
          linkID: "t3_636a7e19a05b08800b06ad4e",
        });
      expect(res.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });
  describe("when the linkID is missing", () => {
    test("should respond with a 400 status code", async () => {
      const res = await request(app)
        .post("/api/save")
        .set("Authorization", token)
        .send({});
      expect(res.statusCode).toBe(400);
    });
  });
  describe("when token is invalid", () => {
    test("should respond with a 401 status code", async () => {
      token = "lkjkl";
      const res = await request(app)
        .post("/api/save")
        .set("Authorization", token)
        .send({
          linkID: "t3_636a7e19a05b08800b06ad4e",
        });
      expect(res.statusCode).toBe(401);
    });
  });
});

describe("POST /api/unsave", () => {
  let token =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFR5cGUiOiJiYXJlIGVtYWlsIiwidXNlcm5hbWUiOiJ0Ml9oYW1hZGEiLCJpYXQiOjE2Njc5NTQzOTMsImV4cCI6MTY2Nzk1Nzk5M30.-KbGLRgSTOC7gdCunSICU0NsbrlOTie98JgKn_tjs-I";

  describe("given a linkID and a valid token", () => {
    test("should respond with a 200 status code", async () => {
      const res = await request(app)
        .post("/api/unsave")
        .set("Authorization", token)
        .send({
          linkID: "t3_636a7e19a05b08800b06ad4e",
        });
      expect(res.statusCode).toBe(200);
    });
    test("should specify json in the content type header", async () => {
      const res = await request(app)
        .post("/api/unsave")
        .set("Authorization", token)
        .send({
          linkID: "t3_636a7e19a05b08800b06ad4e",
        });
      expect(res.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });
  describe("when the linkID is missing", () => {
    test("should respond with a 400 status code", async () => {
      const res = await request(app)
        .post("/api/unsave")
        .set("Authorization", token)
        .send({});
      expect(res.statusCode).toBe(400);
    });
  });
  describe("when token is invalid", () => {
    test("should respond with a 401 status code", async () => {
      token = "lkjkl";
      const res = await request(app)
        .post("/api/unsave")
        .set("Authorization", token)
        .send({
          linkID: "t3_636a7e19a05b08800b06ad4e",
        });
      expect(res.statusCode).toBe(401);
    });
  });
});

describe("vote over a post",()=>{
    let token1="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFR5cGUiOiJiYXJlIGVtYWlsIiwidXNlcm5hbWUiOiJhaG1lZDIzMSIsImlhdCI6MTY2ODEwODA0MCwiZXhwIjoxNjY4MTExNjQwfQ.NCSKQecAt-bn-FnKsiPVgoZ0wWugRWqZA2bsp7CBynA";
    describe("upvote a post",()=>{
        test("should respond with a 200 status code", async () => {
                 
                  const res = await request(app)
                    .post("/api/vote")
                    .set("Authorization", token1)
                    .send({
                        postId:"t3_636ac2f383b37b9ed9aca0ed"
                        ,dir:1
                    });
                  expect(res.statusCode).toBe(200);
        });
    });
    describe("downvote a post",()=>{
        test("should respond with a 200 status code", async () => {
                 
                  const res = await request(app)
                    .post("/api/vote")
                    .set("Authorization", token1)
                    .send({
                        postId:"t3_636ac2f383b37b9ed9aca0ed"
                        ,dir:-1
                    });
                    console.log(res.statusCode);
                  expect(res.statusCode).toBe(200);
        });
    });
    describe("cancel upvote a post",()=>{
        test("should respond with a 200 status code", async () => {
                 
                  const res = await request(app)
                    .post("/api/vote")
                    .set("Authorization", token1)
                    .send({
                        postId:"t3_636ac2f383b37b9ed9aca0ed"
                        ,dir:0
                    });
                    console.log(res.statusCode);
                  expect(res.statusCode).toBe(200);
        });
    });
    describe("cancel downvote a post",()=>{
        test("should respond with a 200 status code", async () => {
                 
                  const res = await request(app)
                    .post("/api/vote")
                    .set("Authorization", token1)
                    .send({
                        postId:"t3_636ac2f383b37b9ed9aca0ed"
                        ,dir:2
                    });
                  expect(res.statusCode).toBe(200);
        });
    });
    describe("upvote to an unvalid post",()=>{
        test("should respond with a 500 status code", async () => {
                 
                  const res = await request(app)
                    .post("/api/vote")
                    .set("Authorization", token1)
                    .send({
                       "postId":"t3_636ac2f383b34311137b9ed9aca0ed"
                        ,"dir":2
                    });
                  expect(res.statusCode).toBe(500);
        });
    });
    describe("unvaild vote dir to an post",()=>{
        test("should respond with a 500 status code", async () => {
                 
                  const res = await request(app)
                    .post("/api/vote")
                    .set("Authorization", token1)
                    .send({
                        postId:"t3_636ac2f383b37b9ed9aca0ed"
                        ,dir:5
                    });
                  expect(res.statusCode).toBe(500);
                  expect(res.body.status).toBe("invalid post id or vote id");
        });
    });
});