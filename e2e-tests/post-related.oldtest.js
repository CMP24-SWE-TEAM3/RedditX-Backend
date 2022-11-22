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
const linkID = "t3_636f5494c56c8d6f0c159090";
describe("POST /api/listing/submit", () => {
  jest.setTimeout(1000000);
  let token =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFR5cGUiOiJiYXJlIGVtYWlsIiwidXNlcm5hbWUiOiJ0Ml9oYW1hZGEiLCJpYXQiOjE2NjgxNzExOTMsImV4cCI6MTY2ODYwMzE5M30.5La8KnuxWTb2u0neXtSWNr_9seVWam0tFEUjAwpqlC0";

  describe("given a text, title, attachment (file) and a valid token", () => {
    test("should respond with a 201 status code", async () => {
      const res = await request(app)
        .post("/api/listing/submit")
        .set("Authorization", token)
        .field(
          "text",
          "This is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post text"
        )
        .field("title", "This is a post title")
        .attach("attachments", `${__dirname}/1.jpg`);
      expect(res.statusCode).toBe(201);
    });
    test("should respond with a body that have a field called userID=t2_hamada", async () => {
      const res = await request(app)
        .post("/api/listing/submit")
        .set("Authorization", token)
        .field(
          "text",
          "This is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post text"
        )
        .field("title", "This is a post title")
        .attach("attachments", `${__dirname}/1.jpg`);
      expect(res.body.userID).toBe("t2_hamada");
    });
    test("should specify json in the content type header", async () => {
      const res = await request(app)
        .post("/api/listing/submit")
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
        .post("/api/listing/submit")
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
        .post("/api/listing/submit")
        .set("Authorization", token)
        .send({
          text: "This is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post textThis is a post text",
          title: "This is a post title",
        });
      expect(res.statusCode).toBe(401);
    });
  });
});

describe("POST /api/listing/save", () => {
  jest.setTimeout(1000000);
  let token =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFR5cGUiOiJiYXJlIGVtYWlsIiwidXNlcm5hbWUiOiJ0Ml9oYW1hZGEiLCJpYXQiOjE2NjgxNzExOTMsImV4cCI6MTY2ODYwMzE5M30.5La8KnuxWTb2u0neXtSWNr_9seVWam0tFEUjAwpqlC0";

  describe("given a linkID and a valid token", () => {
    test("should respond with a 200 status code", async () => {
      const res = await request(app)
        .post("/api/listing/save")
        .set("Authorization", token)
        .send({
          linkID,
        });
      expect(res.statusCode).toBe(200);
    });
    test("should respond with a body that have a field called message=Post is saved successfully", async () => {
      const res = await request(app)
        .post("/api/listing/save")
        .set("Authorization", token)
        .send({
          linkID,
        });
      expect(res.body.message).toBe("Post is saved successfully");
    });
    test("should specify json in the content type header", async () => {
      const res = await request(app)
        .post("/api/listing/save")
        .set("Authorization", token)
        .send({
          linkID,
        });
      expect(res.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });
  describe("when the linkID is missing", () => {
    test("should respond with a 400 status code", async () => {
      const res = await request(app)
        .post("/api/listing/save")
        .set("Authorization", token)
        .send({});
      expect(res.statusCode).toBe(400);
    });
  });
  describe("when token is invalid", () => {
    test("should respond with a 401 status code", async () => {
      token = "lkjkl";
      const res = await request(app)
        .post("/api/listing/save")
        .set("Authorization", token)
        .send({
          linkID,
        });
      expect(res.statusCode).toBe(401);
    });
  });
});

describe("POST /api/listing/unsave", () => {
  jest.setTimeout(1000000);
  let token =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFR5cGUiOiJiYXJlIGVtYWlsIiwidXNlcm5hbWUiOiJ0Ml9oYW1hZGEiLCJpYXQiOjE2NjgxNzExOTMsImV4cCI6MTY2ODYwMzE5M30.5La8KnuxWTb2u0neXtSWNr_9seVWam0tFEUjAwpqlC0";

  describe("given a linkID and a valid token", () => {
    test("should respond with a 200 status code", async () => {
      const res = await request(app)
        .post("/api/listing/unsave")
        .set("Authorization", token)
        .send({
          linkID,
        });
      expect(res.statusCode).toBe(200);
    });
    test("should respond with a body that have a field called message=Post is unsaved successfully", async () => {
      const res = await request(app)
        .post("/api/listing/unsave")
        .set("Authorization", token)
        .send({
          linkID,
        });
      expect(res.body.message).toBe("Post is unsaved successfully");
    });
    test("should specify json in the content type header", async () => {
      const res = await request(app)
        .post("/api/listing/unsave")
        .set("Authorization", token)
        .send({
          linkID,
        });
      expect(res.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });
  describe("when the linkID is missing", () => {
    test("should respond with a 400 status code", async () => {
      const res = await request(app)
        .post("/api/listing/unsave")
        .set("Authorization", token)
        .send({});
      expect(res.statusCode).toBe(400);
    });
  });
  describe("when token is invalid", () => {
    test("should respond with a 401 status code", async () => {
      token = "lkjkl";
      const res = await request(app)
        .post("/api/listing/unsave")
        .set("Authorization", token)
        .send({
          linkID,
        });
      expect(res.statusCode).toBe(401);
    });
  });
});

describe("vote over a post", () => {
  jest.setTimeout(1000000);
  let token1 =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFR5cGUiOiJiYXJlIGVtYWlsIiwidXNlcm5hbWUiOiJ0Ml9oYW1hZGEiLCJpYXQiOjE2NjgxNzExOTMsImV4cCI6MTY2ODYwMzE5M30.5La8KnuxWTb2u0neXtSWNr_9seVWam0tFEUjAwpqlC0";
  describe("upvote a post", () => {
    test("should respond with a 200 status code", async () => {
      const res = await request(app)
        .post("/api/listing/vote")
        .set("Authorization", token1)
        .send({
          id: "t3_636f5494c56c8d6f0c159090",
          dir: 1,
        });
      expect(res.statusCode).toBe(200);
    });
  });
  describe("downvote a post", () => {
    test("should respond with a 200 status code", async () => {
      const res = await request(app)
        .post("/api/listing/vote")
        .set("Authorization", token1)
        .send({
          id: "t3_636f5494c56c8d6f0c159090",
          dir: -1,
        });
      expect(res.statusCode).toBe(200);
    });
  });
  // describe("cancel upvote a post", () => {
  //   test("should respond with a 200 status code", async () => {
  //     const res = await request(app)
  //       .post("/api/listing/vote")
  //       .set("Authorization", token1)
  //       .send({
  //         id: 't3_636f5494c56c8d6f0c159090',
  //         dir: 0,
  //       });
  //     expect(res.statusCode).toBe(200);
  //   });
  // });
  // describe("cancel downvote a post", () => {
  //   test("should respond with a 200 status code", async () => {
  //     const res = await request(app)
  //       .post("/api/listing/vote")
  //       .set("Authorization", token1)
  //       .send({
  //         id: 't3_636f5494c56c8d6f0c159090',
  //         dir: 2,
  //       });
  //     expect(res.statusCode).toBe(200);
  //   });
  // });
  describe("upvote to an invalid post", () => {
    test("should respond with a 500 status code", async () => {
      const res = await request(app)
        .post("/api/listing/vote")
        .set("Authorization", token1)
        .send({
          id: "t3_636f5494c56c8d6f0c15342009090",
          dir: 2,
        });
      expect(res.statusCode).toBe(500);
    });
  });
  describe("invaild vote dir to an post", () => {
    test("should respond with a 500 status code", async () => {
      const res = await request(app)
        .post("/api/listing/vote")
        .set("Authorization", token1)
        .send({
          id: "t3_636f5494c56c8d6f0c159090",
          dir: 5,
        });
      expect(res.statusCode).toBe(500);
      expect(res.body.status).toBe("invalid id or dir");
    });
  });

  describe("upvote to an invalid comment", () => {
    test("should respond with a 500 status code", async () => {
      const res = await request(app)
        .post("/api/listing/vote")
        .set("Authorization", token1)
        .send({
          id: "t1_636ac2f383b34311137b9ed9aca0ed",
          dir: 2,
        });
      expect(res.statusCode).toBe(500);
    });
  });
  describe("invaild vote dir to an comment", () => {
    test("should respond with a 500 status code", async () => {
      const res = await request(app)
        .post("/api/listing/vote")
        .set("Authorization", token1)
        .send({
          id: "t1_636a8816687a4fec0ac7c3fc",
          dir: 5,
        });
      expect(res.statusCode).toBe(500);
    });
  });
  describe("upvote to an comment", () => {
    test("should respond with a 200 status code", async () => {
      const res = await request(app)
        .post("/api/listing/vote")
        .set("Authorization", token1)
        .send({
          id: "t1_636a8816687a4fec0ac7c3fc",
          dir: 1,
        });
      expect(res.statusCode).toBe(200);
    });
  });
  describe("upvote to a non-existing comment", () => {
    test("should respond with a 500 status code", async () => {
      const res = await request(app)
        .post("/api/listing/vote")
        .set("Authorization", token1)
        .send({
          id: "t1_636a8816687a4f998ec0ac7c3fc",
          dir: 2,
        });
      expect(res.statusCode).toBe(500);
    });
  });
  describe("downvote a comment", () => {
    test("should respond with a 200 status code", async () => {
      const res = await request(app)
        .post("/api/listing/vote")
        .set("Authorization", token1)
        .send({
          id: "t1_636a8816687a4fec0ac7c3fc",
          dir: -1,
        });
      expect(res.statusCode).toBe(200);
    });
  });
  // describe("cancel upvote a comment", () => {
  //   test("should respond with a 200 status code", async () => {
  //     const res = await request(app)
  //       .post("/api/listing/vote")
  //       .set("Authorization", token1)
  //       .send({
  //         id: "t1_636a8816687a4fec0ac7c3fc",
  //         dir: 0,
  //       });
  //     expect(res.statusCode).toBe(200);
  //   });
  // });
  describe("cancel downvote a comment", () => {
    test("should respond with a 200 status code", async () => {
      const res = await request(app)
        .post("/api/listing/vote")
        .set("Authorization", token1)
        .send({
          id: "t1_636a8816687a4fec0ac7c3fc",
          dir: 2,
        });
      expect(res.statusCode).toBe(200);
    });
  });
});
