/* eslint-disable */
const request = require("supertest");
const app = require("../app");
const dotenv = require("dotenv");
dotenv.config({ path: "./../config.env" });
const dbConnect = require("../db-connection/connection");
const User = require("../models/user-model");
const jwt = require("jsonwebtoken");

jest.setTimeout(100000);

/* Connecting to the database before each test. */
beforeAll(async () => {
  dbConnect();
});

let token =
  "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFR5cGUiOiJiYXJlIGVtYWlsIiwidXNlcm5hbWUiOiJ0Ml9tb2F6SGFzc2FuIiwiaWF0IjoxNjY4MjE0NzAwLCJleHAiOjE2Njg2NDY3MDB9.2nc2rNlO4cpv453m5bQ9MTgCVW8SAJ8whNxCYgGFdQ4";

const subreddit = "t5_imagePro45";
/****************************************************************************************************************************************
 * get: r/{subreddit}/new
 * **************************************************************************************************************************************
 */

describe("GET /api/listing/posts/new if not signed in", () => {
  it("should return all new posts from all subreddits ", async () => {
    const res = await request(app).get("/api/listing/posts/new");
    const posts = res.body.posts;
    let successInTime = true;
    for (let i = 1; i < res.body.posts.length; i++) {
      if (new Date(posts[i].createdAt) > new Date(posts[i - 1].createdAt)) {
        successInTime = false;
        break;
      }
    }
    expect(res.statusCode).toBe(200);
    expect(posts.length).toBeGreaterThan(0);
    expect(successInTime).toBe(true);
  });
});

describe("GET /api/listing/posts/r/{subreddit}/new if not signed in", () => {
  it("should return all new posts from all subreddits ", async () => {
    const res = await request(app).get(`/api/listing/posts/r/${subreddit}/new`);
    const posts = res.body.posts;
    let successInTime = true;
    for (let i = 1; i < res.body.posts.length; i++) {
      if (new Date(posts[i].createdAt) > new Date(posts[i - 1].createdAt)) {
        successInTime = false;
        break;
      }
    }
    let successInCommunity = true;
    for (let i = 1; i < res.body.posts.length; i++) {
      if (posts[i].communityID !== subreddit) {
        successInCommunity = false;
        break;
      }
    }
    expect(res.statusCode).toBe(200);
    expect(posts.length).toBeGreaterThan(0);
    expect(successInTime).toBe(true);
    expect(successInCommunity).toBe(true);
  });
});

describe("GET /api/listing/posts/new if he is signed in", () => {
  /* in this test we will test the subreddits and users of the posts returned*/
  it("should return all new posts from all subreddits ", async () => {
    const res = await request(app)
      .get("/api/listing/posts/new")
      .set("Authorization", token);
    const posts = res.body.posts;
    let successInTime = true;
    let successInSubredditsAndUsers = true;
    const decoded = jwt.verify(
      token.split(" ")[1],
      "mozaisSoHotButNabilisTheHottest"
    );
    const username = decoded.username;
    const user = await User.findById(username);
    const friends = user.friend;
    const follows = user.follows;
    const subreddits = user.member.map((el) => {
      if (!el.isBanned) return el.communityId;
    });
    for (let i = 1; i < res.body.posts.length; i++) {
      if (new Date(posts[i].createdAt) > new Date(posts[i - 1].createdAt)) {
        successInTime = false;
        break;
      }
    }
    for (let i = 0; i < res.body.posts.length; i++) {
      if (
        subreddits.indexOf(posts[i].communityID) === -1 &&
        friends.indexOf(posts[i].userID) === -1 &&
        follows.indexOf(posts[i].userID) === -1
      ) {
        successInSubredditsAndUsers = false;
        break;
      }
    }
    expect(res.statusCode).toBe(200);
    expect(posts.length).toBeGreaterThan(0);
    expect(successInTime).toBe(true);
    expect(successInSubredditsAndUsers).toBe(true);
  });
});

describe("GET /api/listing/posts/r/{subreddit}/new if he is signed in", () => {
  /*this test is very similar ti its corresponding but sithout authentication */
  it("should return all new posts from all subreddits ", async () => {
    const res = await request(app)
      .get(`/api/listing/posts/r/${subreddit}/new`)
      .set("Authorization", token);
    const posts = res.body.posts;
    let successInTime = true;
    for (let i = 1; i < res.body.posts.length; i++) {
      if (new Date(posts[i].createdAt) > new Date(posts[i - 1].createdAt)) {
        successInTime = false;
        break;
      }
    }
    let successInCommunity = true;
    for (let i = 1; i < res.body.posts.length; i++) {
      if (posts[i].communityID !== subreddit) {
        successInCommunity = false;
        break;
      }
    }
    expect(res.statusCode).toBe(200);
    expect(posts.length).toBeGreaterThan(0);
    expect(successInTime).toBe(true);
    expect(successInCommunity).toBe(true);
  });
});

/****************************************************************************************************************************************
 * get: /api/listing/posts/r/{subreddit}/best
 * **************************************************************************************************************************************
 */

describe("GET /api/listing/posts/best if not signed in", () => {
  it("should return all best posts from all subreddits ", async () => {
    const res = await request(app).get("/api/listing/posts/best");
    const posts = res.body.posts;
    let successIncriteria = true;
    for (let i = 1; i < res.body.posts.length; i++) {
      if (
        ((new Date(posts[i].createdAt).getDay() / 30 +
          new Date(posts[i].createdAt).getYear() / 2022 +
          new Date(posts[i].createdAt).getMonth() / 30) *
          1) /
          3 +
          posts[i].votesCount +
          posts[i].commentsNum >
        ((new Date(posts[i - 1].createdAt).getDay() / 30 +
          new Date(posts[i - 1].createdAt).getYear() / 2022 +
          new Date(posts[i - 1].createdAt).getMonth() / 30) *
          1) /
          3 +
          posts[i - 1].votesCount +
          posts[i - 1].commentsNum
      ) {
        successIncriteria = false;
        break;
      }
    }
    expect(res.statusCode).toBe(200);
    expect(posts.length).toBeGreaterThan(0);
    expect(successIncriteria).toBe(true);
  });
});

describe("GET /api/listing/posts/r/{subreddit}/best if not signed in", () => {
  it("should return all best posts from all subreddits ", async () => {
    const res = await request(app).get(
      `/api/listing/posts/r/${subreddit}/best`
    );
    const posts = res.body.posts;
    let successIncriteria = true;
    for (let i = 1; i < res.body.posts.length; i++) {
      if (
        ((new Date(posts[i].createdAt).getDay() / 30 +
          new Date(posts[i].createdAt).getYear() / 2022 +
          new Date(posts[i].createdAt).getMonth() / 30) *
          1) /
          3 +
          posts[i].votesCount +
          posts[i].commentsNum >
        ((new Date(posts[i - 1].createdAt).getDay() / 30 +
          new Date(posts[i - 1].createdAt).getYear() / 2022 +
          new Date(posts[i - 1].createdAt).getMonth() / 30) *
          1) /
          3 +
          posts[i - 1].votesCount +
          posts[i - 1].commentsNum
      ) {
        successIncriteria = false;
        break;
      }
    }
    let successInCommunity = true;
    for (let i = 1; i < res.body.posts.length; i++) {
      if (posts[i].communityID !== subreddit) {
        successInCommunity = false;
        break;
      }
    }
    expect(res.statusCode).toBe(200);
    expect(posts.length).toBeGreaterThan(0);
    expect(successIncriteria).toBe(true);
    expect(successInCommunity).toBe(true);
  });
});

describe("GET /api/listing/posts/best if he is signed in", () => {
  /* in this test we will test the subreddits and users of the posts returned*/
  it("should return all best posts from all subreddits ", async () => {
    const res = await request(app)
      .get("/api/listing/posts/best")
      .set("Authorization", token);
    const posts = res.body.posts;
    let successIncriteria = true;
    let successInSubredditsAndUsers = true;
    const decoded = jwt.verify(
      token.split(" ")[1],
      "mozaisSoHotButNabilisTheHottest"
    );
    const username = decoded.username;
    const user = await User.findById(username);
    const friends = user.friend;
    const follows = user.follows;

    const subreddits = user.member.map((el) => {
      if (!el.isBanned) return el.communityId;
    });
    for (let i = 1; i < res.body.posts.length; i++) {
      if (
        ((new Date(posts[i].createdAt).getDay() / 30 +
          new Date(posts[i].createdAt).getYear() / 2022 +
          new Date(posts[i].createdAt).getMonth() / 30) *
          1) /
          3 +
          posts[i].votesCount +
          posts[i].commentsNum >
        ((new Date(posts[i - 1].createdAt).getDay() / 30 +
          new Date(posts[i - 1].createdAt).getYear() / 2022 +
          new Date(posts[i - 1].createdAt).getMonth() / 30) *
          1) /
          3 +
          posts[i - 1].votesCount +
          posts[i - 1].commentsNum
      ) {
        successIncriteria = false;
        break;
      }
    }
    for (let i = 0; i < res.body.posts.length; i++) {
      if (
        subreddits.indexOf(posts[i].communityID) === -1 &&
        friends.indexOf(posts[i].userID) === -1 &&
        follows.indexOf(posts[i].userID) === -1
      ) {
        successInSubredditsAndUsers = false;
        break;
      }
    }
    expect(res.statusCode).toBe(200);
    expect(posts.length).toBeGreaterThan(0);
    expect(successIncriteria).toBe(true);
    expect(successInSubredditsAndUsers).toBe(true);
  });
});

describe("GET /api/listing/posts/r/{subreddit}/best if he is signed in", () => {
  /*this test is very similar ti its corresponding but sithout authentication */
  it("should return all best posts from all subreddits ", async () => {
    const res = await request(app)
      .get(`/api/listing/posts/r/${subreddit}/best`)
      .set("Authorization", token);
    const posts = res.body.posts;
    let successIncriteria = true;
    let successInCommunity = true;
    for (let i = 1; i < res.body.posts.length; i++) {
      if (posts[i].communityID !== subreddit) {
        successInCommunity = false;
        break;
      }
    }
    for (let i = 1; i < res.body.posts.length; i++) {
      if (
        ((new Date(posts[i].createdAt).getDay() / 30 +
          new Date(posts[i].createdAt).getYear() / 2022 +
          new Date(posts[i].createdAt).getMonth() / 30) *
          1) /
          3 +
          posts[i].votesCount +
          posts[i].commentsNum >
        ((new Date(posts[i - 1].createdAt).getDay() / 30 +
          new Date(posts[i - 1].createdAt).getYear() / 2022 +
          new Date(posts[i - 1].createdAt).getMonth() / 30) *
          1) /
          3 +
          posts[i - 1].votesCount +
          posts[i - 1].commentsNum
      ) {
        successIncriteria = false;
        break;
      }
    }
    expect(res.statusCode).toBe(200);
    expect(posts.length).toBeGreaterThan(0);
    expect(successIncriteria).toBe(true);
    expect(successInCommunity).toBe(true);
  });
});

/****************************************************************************************************************************************
 * get: /api/listing/posts/r/{subreddit}/hot
 * **************************************************************************************************************************************
 */

describe("GET /api/listing/posts/hot if not signed in", () => {
  it("should return all hot posts from all subreddits ", async () => {
    const res = await request(app).get("/api/listing/posts/hot");
    const posts = res.body.posts;
    let successIncriteria = true;
    for (let i = 1; i < res.body.posts.length; i++) {
      if (
        ((new Date(posts[i].createdAt).getDay() / 30 +
          new Date(posts[i].createdAt).getYear() / 2022 +
          new Date(posts[i].createdAt).getMonth() / 30) *
          2) /
          3 +
          posts[i].votesCount +
          posts[i].commentsNum >
        ((new Date(posts[i - 1].createdAt).getDay() / 30 +
          new Date(posts[i - 1].createdAt).getYear() / 2022 +
          new Date(posts[i - 1].createdAt).getMonth() / 30) *
          2) /
          3 +
          posts[i - 1].votesCount +
          posts[i - 1].commentsNum
      ) {
        successIncriteria = false;
        break;
      }
    }
    expect(res.statusCode).toBe(200);
    expect(posts.length).toBeGreaterThan(0);
    expect(successIncriteria).toBe(true);
  });
});

describe("GET /api/listing/posts/r/{subreddit}/hot if not signed in", () => {
  it("should return all hot posts from all subreddits ", async () => {
    const res = await request(app).get(`/api/listing/posts/r/${subreddit}/hot`);
    const posts = res.body.posts;
    let successIncriteria = true;
    for (let i = 1; i < res.body.posts.length; i++) {
      if (
        ((new Date(posts[i].createdAt).getDay() / 30 +
          new Date(posts[i].createdAt).getYear() / 2022 +
          new Date(posts[i].createdAt).getMonth() / 30) *
          2) /
          3 +
          posts[i].votesCount +
          posts[i].commentsNum >
        ((new Date(posts[i - 1].createdAt).getDay() / 30 +
          new Date(posts[i - 1].createdAt).getYear() / 2022 +
          new Date(posts[i - 1].createdAt).getMonth() / 30) *
          2) /
          3 +
          posts[i - 1].votesCount +
          posts[i - 1].commentsNum
      ) {
        successIncriteria = false;
        break;
      }
    }
    let successInCommunity = true;
    for (let i = 1; i < res.body.posts.length; i++) {
      if (posts[i].communityID !== subreddit) {
        successInCommunity = false;
        break;
      }
    }
    expect(res.statusCode).toBe(200);
    expect(posts.length).toBeGreaterThan(0);
    expect(successIncriteria).toBe(true);
    expect(successInCommunity).toBe(true);
  });
});

describe("GET /api/listing/posts/hot if he is signed in", () => {
  /* in this test we will test the subreddits and users of the posts returned*/
  it("should return all hot posts from all subreddits ", async () => {
    const res = await request(app)
      .get("/api/listing/posts/hot")
      .set("Authorization", token);
    const posts = res.body.posts;
    let successIncriteria = true;
    let successInSubredditsAndUsers = true;
    const decoded = jwt.verify(
      token.split(" ")[1],
      "mozaisSoHotButNabilisTheHottest"
    );
    const username = decoded.username;
    const user = await User.findById(username);
    const friends = user.friend;
    const follows = user.follows;
    const subreddits = user.member.map((el) => {
      if (!el.isBanned) return el.communityId;
    });

    for (let i = 1; i < res.body.posts.length; i++) {
      if (
        ((new Date(posts[i].createdAt).getDay() / 30 +
          new Date(posts[i].createdAt).getYear() / 2022 +
          new Date(posts[i].createdAt).getMonth() / 30) *
          2) /
          3 +
          posts[i].votesCount +
          posts[i].commentsNum >
        ((new Date(posts[i - 1].createdAt).getDay() / 30 +
          new Date(posts[i - 1].createdAt).getYear() / 2022 +
          new Date(posts[i - 1].createdAt).getMonth() / 30) *
          2) /
          3 +
          posts[i - 1].votesCount +
          posts[i - 1].commentsNum
      ) {
        successIncriteria = false;
        break;
      }
    }
    for (let i = 0; i < res.body.posts.length; i++) {
      if (
        subreddits.indexOf(posts[i].communityID) === -1 &&
        friends.indexOf(posts[i].userID) === -1 &&
        follows.indexOf(posts[i].userID) === -1
      ) {
        successInSubredditsAndUsers = false;
        break;
      }
    }
    expect(res.statusCode).toBe(200);
    expect(posts.length).toBeGreaterThan(0);
    expect(successIncriteria).toBe(true);
    expect(successInSubredditsAndUsers).toBe(true);
  });
});

describe("GET /api/listing/posts/r/{subreddit}/hot if he is signed in", () => {
  /*this test is very similar ti its corresponding but sithout authentication */
  it("should return all hot posts from all subreddits ", async () => {
    const res = await request(app)
      .get(`/api/listing/posts/r/${subreddit}/hot`)
      .set("Authorization", token);
    const posts = res.body.posts;
    let successIncriteria = true;
    let successInCommunity = true;
    for (let i = 1; i < res.body.posts.length; i++) {
      if (posts[i].communityID !== subreddit) {
        successInCommunity = false;
        break;
      }
    }
    for (let i = 1; i < res.body.posts.length; i++) {
      if (
        ((new Date(posts[i].createdAt).getDay() / 30 +
          new Date(posts[i].createdAt).getYear() / 2022 +
          new Date(posts[i].createdAt).getMonth() / 30) *
          2) /
          3 +
          posts[i].votesCount +
          posts[i].commentsNum >
        ((new Date(posts[i - 1].createdAt).getDay() / 30 +
          new Date(posts[i - 1].createdAt).getYear() / 2022 +
          new Date(posts[i - 1].createdAt).getMonth() / 30) *
          2) /
          3 +
          posts[i - 1].votesCount +
          posts[i - 1].commentsNum
      ) {
        successIncriteria = false;
        break;
      }
    }
    expect(res.statusCode).toBe(200);
    expect(posts.length).toBeGreaterThan(0);
    expect(successIncriteria).toBe(true);
    expect(successInCommunity).toBe(true);
  });
});

/****************************************************************************************************************************************
 * get: /api/listing/posts/top
 * **************************************************************************************************************************************
 */

describe("GET /api/listing/posts/top if not signed in", () => {
  it("should return all top posts from all subreddits ", async () => {
    const res = await request(app).get("/api/listing/posts/top");
    const posts = res.body.posts;
    let successIncriteria = true;
    for (let i = 1; i < res.body.posts.length; i++) {
      if (posts[i].votesCount > posts[i - 1].votesCount) {
        console.log(posts[i]);
        console.log(posts[i - 1]);
        successIncriteria = false;
        break;
      }
    }
    expect(res.statusCode).toBe(200);
    expect(posts.length).toBeGreaterThan(0);
    expect(successIncriteria).toBe(true);
  });
});

describe("GET /api/listing/posts/r/{subreddit}/top if not signed in", () => {
  it("should return all top posts from all subreddits ", async () => {
    const res = await request(app).get(`/api/listing/posts/r/${subreddit}/top`);
    const posts = res.body.posts;
    let successIncriteria = true;
    for (let i = 1; i < res.body.posts.length; i++) {
      if (posts[i].votesCount > posts[i - 1].votesCount) {
        console.log(posts[i]);
        console.log(posts[i - 1]);
        successIncriteria = false;
        break;
      }
    }
    let successInCommunity = true;
    for (let i = 1; i < res.body.posts.length; i++) {
      if (posts[i].communityID !== subreddit) {
        successInCommunity = false;
        break;
      }
    }
    expect(res.statusCode).toBe(200);
    expect(posts.length).toBeGreaterThan(0);
    expect(successIncriteria).toBe(true);
    expect(successInCommunity).toBe(true);
  });
});

describe("GET /api/listing/posts/top if he is signed in", () => {
  /* in this test we will test the subreddits and users of the posts returned*/
  it("should return all top posts from all subreddits ", async () => {
    const res = await request(app)
      .get("/api/listing/posts/top")
      .set("Authorization", token);
    const posts = res.body.posts;
    let successIncriteria = true;
    let successInSubredditsAndUsers = true;
    const decoded = jwt.verify(
      token.split(" ")[1],
      "mozaisSoHotButNabilisTheHottest"
    );
    const username = decoded.username;
    const user = await User.findById(username);
    const friends = user.friend;
    const follows = user.follows;

    const subreddits = user.member.map((el) => {
      if (!el.isBanned) return el.communityId;
    });

    for (let i = 1; i < res.body.posts.length; i++) {
      if (posts[i].votesCount > posts[i - 1].votesCount) {
        successIncriteria = false;
        break;
      }
    }
    for (let i = 0; i < res.body.posts.length; i++) {
      if (
        subreddits.indexOf(posts[i].communityID) === -1 &&
        friends.indexOf(posts[i].userID) === -1 &&
        follows.indexOf(posts[i].userID) === -1
      ) {
        successInSubredditsAndUsers = false;
        break;
      }
    }
    expect(res.statusCode).toBe(200);
    expect(posts.length).toBeGreaterThan(0);
    expect(successIncriteria).toBe(true);
    expect(successInSubredditsAndUsers).toBe(true);
  });
});

describe("GET /api/listing/posts/r/{subreddit}/top if he is signed in", () => {
  /*this test is very similar ti its corresponding but sithout authentication */
  it("should return all top posts from all subreddits ", async () => {
    const res = await request(app)
      .get(`/api/listing/posts/r/${subreddit}/top`)
      .set("Authorization", token);
    const posts = res.body.posts;
    let successIncriteria = true;
    let successInCommunity = true;
    for (let i = 1; i < res.body.posts.length; i++) {
      if (posts[i].communityID !== subreddit) {
        successInCommunity = false;
        break;
      }
    }
    for (let i = 1; i < res.body.posts.length; i++) {
      if (posts[i].votesCount > posts[i - 1].votesCount) {
        successIncriteria = false;
        break;
      }
    }
    expect(res.statusCode).toBe(200);
    expect(posts.length).toBeGreaterThan(0);
    expect(successIncriteria).toBe(true);
    expect(successInCommunity).toBe(true);
  });
});

/****************************************************************************************************************************************
 * get: /api/listing/posts/random
 * **************************************************************************************************************************************
 */

describe("GET /api/listing/posts/random if not signed in", () => {
  it("should return all random posts from all subreddits ", async () => {
    const res = await request(app).get("/api/listing/posts/random");
    const posts = res.body.posts;
    expect(res.statusCode).toBe(200);
    expect(posts.length).toBeGreaterThan(0);
  });
});

describe("GET /api/listing/posts/r/{subreddit}/random if not signed in", () => {
  it("should return all random posts from all subreddits ", async () => {
    const res = await request(app).get(
      `/api/listing/posts/r/${subreddit}/random`
    );
    const posts = res.body.posts;
    let successIncriteria = true;
    let successInCommunity = true;
    for (let i = 1; i < res.body.posts.length; i++) {
      if (posts[i].communityID !== subreddit) {
        successInCommunity = false;
        break;
      }
    }
    expect(res.statusCode).toBe(200);
    expect(posts.length).toBeGreaterThan(0);
    expect(successInCommunity).toBe(true);
  });
});

describe("GET /api/listing/posts/random if he is signed in", () => {
  /* in this test we will test the subreddits and users of the posts returned*/
  it("should return all random posts from all subreddits ", async () => {
    const res = await request(app)
      .get("/api/listing/posts/random")
      .set("Authorization", token);
    const posts = res.body.posts;
    let successIncriteria = true;
    let successInSubredditsAndUsers = true;
    const decoded = jwt.verify(
      token.split(" ")[1],
      "mozaisSoHotButNabilisTheHottest"
    );
    const username = decoded.username;
    const user = await User.findById(username);
    const friends = user.friend;
    const follows = user.follows;
    const subreddits = user.member.map((el) => {
      if (!el.isBanned) return el.communityId;
    });
    for (let i = 0; i < res.body.posts.length; i++) {
      if (
        subreddits.indexOf(posts[i].communityID) === -1 &&
        friends.indexOf(posts[i].userID) === -1 &&
        follows.indexOf(posts[i].userID) === -1
      ) {
        successInSubredditsAndUsers = false;
        break;
      }
    }
    expect(res.statusCode).toBe(200);
    expect(posts.length).toBeGreaterThan(0);
    expect(successInSubredditsAndUsers).toBe(true);
  });
});

describe("GET /api/listing/posts/r/{subreddit}/random if he is signed in", () => {
  /*this test is very similar ti its corresponding but sithout authentication */
  it("should return all random posts from all subreddits ", async () => {
    const res = await request(app)
      .get(`/api/listing/posts/r/${subreddit}/random`)
      .set("Authorization", token);
    const posts = res.body.posts;
    let successInCommunity = true;
    for (let i = 1; i < res.body.posts.length; i++) {
      if (posts[i].communityID !== subreddit) {
        successInCommunity = false;
        break;
      }
    }
    expect(res.statusCode).toBe(200);
    expect(posts.length).toBeGreaterThan(0);
    expect(successInCommunity).toBe(true);
  });
});
