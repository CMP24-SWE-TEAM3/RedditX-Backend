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
  describe("test username overview", () => {
    describe("username overview", () => {
      const username = "t2_hamada";
      test("should respond with 200 status code", async () => {
        const res = await request(app).get(`/api/user/overview/${username}`);
        expect(res.statusCode).toBe(200);
      });
    });
    describe("username overview", () => {
      const username = "t2_hamada";
      test("should specify json in the content type header", async () => {
        const res = await request(app).get(`/api/user/overview/${username}`);

        expect(res.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
      });
    });
    describe("username overview", () => {
      const username = "t2_hamada";
      test("should respond with a body that have a field called title to be equal This is a post title", async () => {
        const res = await request(app).get(`/api/user/overview/${username}`);
        expect(res.body.data[0].userID).toBe(username);
      });
    });
    describe("username overview", () => {
      const username = "t2_hamd";
      test("should respond with 404 status code", async () => {
        const res = await request(app).get(`/api/user/overview/${username}`);

        expect(res.statusCode).toBe(404);
      });
    });
  });
});

describe("User System", () => {
  describe("test username comments", () => {
    describe("username comments", () => {
      const username = "t2_hamada";
      test("should respond with 200 status code", async () => {
        const res = await request(app).get(`/api/user/comment/${username}`);

        expect(res.statusCode).toBe(200);
      });
    });
    describe("username comments", () => {
      const username = "t2_hamada";
      test("should specify json in the content type header", async () => {
        const res = await request(app).get(`/api/user/comment/${username}`);

        expect(res.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
      });
    });
    describe("username comments", () => {
      const username = "t2_hamada";
      test("should respond with a body that have a field called userId ", async () => {
        const res = await request(app).get(`/api/user/comment/${username}`);
        expect(res.body.data[0].authorId).toBe("t2_moazMohamed");
      });
    });
    describe("username comments", () => {
      const username = "t2_hamd";
      test("should respond with 404 status code", async () => {
        const res = await request(app).get(`/api/user/comment/${username}`);

        expect(res.statusCode).toBe(404);
      });
    });
  });
});

describe("User System", () => {
  describe("test username posts", () => {
    describe("username posts", () => {
      const username = "t2_hamada";
      test("should respond with 200 status code", async () => {
        const res = await request(app).get(`/api/user/submitted/${username}`);

        expect(res.statusCode).toBe(200);
      });
    });
    describe("username posts", () => {
      const username = "t2_hamada";
      test("should specify json in the content type header", async () => {
        const res = await request(app).get(`/api/user/submitted/${username}`);

        expect(res.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
      });
    });
    describe("username posts", () => {
      const username = "t2_hamada";
      test("should respond with a body that have a field called postTitile to be equal 2022-11-08T18:33:20.176Z", async () => {
        const res = await request(app).get(`/api/user/submitted/${username}`);
        expect(res.body.data[0].title).toBe("This is a post title");
      });
    });
    describe("username posts", () => {
      const username = "t2_hamd";
      test("should respond with 404 status code", async () => {
        const res = await request(app).get(`/api/user/submitted/${username}`);

        expect(res.statusCode).toBe(404);
      });
    });
  });
});
describe("User System", () => {
  describe("test username downvotes", () => {
    describe("username downvotes", () => {
      const username = "t2_hamada";
      test("should respond with 200 status code", async () => {
        const res = await request(app).get(`/api/user/downvoted/${username}`);

        expect(res.statusCode).toBe(200);
      });
    });
    describe("username downvotes", () => {
      const username = "t2_hamada";
      test("should specify json in the content type header", async () => {
        const res = await request(app).get(`/api/user/downvoted/${username}`);

        expect(res.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
      });
    });
    describe("username downvotes", () => {
      const username = "t2_hamada";
      test("should respond with a body that have a field called flairText to be equal hero", async () => {
        const res = await request(app).get(`/api/user/downvoted/${username}`);

        expect(res.body.data[0].title).toBe("This is a post title");
      });
    });
    describe("username downvotes", () => {
      const username = "t2_hamd";
      test("should respond with 404 status code", async () => {
        const res = await request(app).get(`/api/user/downvoted/${username}`);

        expect(res.statusCode).toBe(404);
      });
    });
  });
});
describe("User System", () => {
  describe("test username upvotes", () => {
    describe("username upvotes", () => {
      const username = "t2_hamada";
      test("should respond with 200 status code", async () => {
        const res = await request(app).get(`/api/user/upvoted/${username}`);

        expect(res.statusCode).toBe(200);
      });
    });
    describe("username upvotes", () => {
      const username = "t2_hamada";
      test("should specify json in the content type header", async () => {
        const res = await request(app).get(`/api/user/upvoted/${username}`);

        expect(res.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
      });
    });
    describe("username upvotes", () => {
      const username = "t2_hamada";
      test("should respond with a body that have a field called postTitle", async () => {
        const res = await request(app).get(`/api/user/upvoted/${username}`);

        expect(res.body.data[0].title).toBe("This is a post title");
      });
    });
    describe("username upvotes", () => {
      const username = "t2_hamd";
      test("should respond with 404 status code", async () => {
        const res = await request(app).get(`/api/user/upvoted/${username}`);

        expect(res.statusCode).toBe(404);
      });
    });
  });
});
