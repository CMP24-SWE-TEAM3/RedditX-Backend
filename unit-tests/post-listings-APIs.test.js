const request = require("supertest");
const app = require("./../app");
const dotenv = require("dotenv");
dotenv.config({ path: "./../config.env" });
const dbConnect = require("./../db-connection/connection");
const User = require('../models/user-model');
const jwt = require('jsonwebtoken');

jest.setTimeout(100000);

/* Connecting to the database before each test. */
beforeAll(async () => {
    dbConnect();
});

/****************************************************************************************************************************************
 * get: r/{subreddit}/new
 * **************************************************************************************************************************************
 */

describe("GET /r/new if not signed in", () => {
    it("should return all new posts from all subreddits ", async () => {
        const res = await request(app).get("/r/new");
        const posts = res.body.posts;
        let successInTime = true;
        for (let i = 1; i < res.body.posts.length; i++) {
            if (posts[i].createdAt > posts[i - 1].createdAt) {
                successInTime = false;
                break;
            }
        }
        expect(res.statusCode).toBe(200);
        expect(posts.length).toBeGreaterThan(0);
        expect(successInTime).toBe(true);
    });
});



describe("GET /r/{subreddit}/new if not signed in", () => {
    it("should return all new posts from all subreddits ", async () => {
        const subreddit = 'tesla'
        const res = await request(app).get(`/r/${subreddit}/new`);
        const posts = res.body.posts;
        let successInTime = true;
        for (let i = 1; i < res.body.posts.length; i++) {
            if (posts[i].createdAt > posts[i - 1].createdAt) {
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



describe("GET /r/new if he is signed in", () => {
    /* in this test we will test the subreddits and users of the posts returned*/
    it("should return all new posts from all subreddits ", async () => {
        let token = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFR5cGUiOiJiYXJlIGVtYWlsIiwidXNlcm5hbWUiOiJ0Ml9uYWJpbDEiLCJpYXQiOjE2Njc5NDUyMjgsImV4cCI6MTY2Nzk0ODgyOH0.ipUlWcnp783qRn8X6yQaJBNKoChTREBXiTBC9GdbrNY';
        const res = await request(app).get("/r/new").set("Authorization", token);
        const posts = res.body.posts;
        let successInTime = true;
        let successInSubredditsAndUsers = true;
        const decoded = jwt.verify(token.split(' ')[1], "mozaisSoHotButNabilisTheHottest");
        const username = decoded.username;
        const user = await User.findById(username);
        const friends = user.friend;
        const subreddits = user.member.map((el) => {
            if (!el.isBanned)
                return el.communityId;
        })
        for (let i = 1; i < res.body.posts.length; i++) {
            if (posts[i].createdAt > posts[i - 1].createdAt) {
                successInTime = false;
                break;
            }
        }
        for (let i = 0; i < res.body.posts.length; i++) {
            if (subreddits.indexOf(posts[i].communityID) === -1 && friends.indexOf(posts[i].userID) === -1) {
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



describe("GET /r/{subreddit}/new if he is signed in", () => {
    /*this test is very similar ti its corresponding but sithout authentication */
    it("should return all new posts from all subreddits ", async () => {
        let token = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFR5cGUiOiJiYXJlIGVtYWlsIiwidXNlcm5hbWUiOiJ0Ml9uYWJpbDEiLCJpYXQiOjE2Njc5NDUyMjgsImV4cCI6MTY2Nzk0ODgyOH0.ipUlWcnp783qRn8X6yQaJBNKoChTREBXiTBC9GdbrNY';
        const subreddit = 'tesla'
        const res = await request(app).get(`/r/${subreddit}/new`).set('Authorization', token);
        const posts = res.body.posts;
        let successInTime = true;
        for (let i = 1; i < res.body.posts.length; i++) {
            if (posts[i].createdAt > posts[i - 1].createdAt) {
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
 * get: r/{subreddit}/best
 * **************************************************************************************************************************************
 */

describe("GET /r/best if not signed in", () => {
    it("should return all best posts from all subreddits ", async () => {
        const res = await request(app).get("/r/best");
        const posts = res.body.posts;
        let successIncriteria = true;
        for (let i = 1; i < res.body.posts.length; i++) {
            if (posts[i].createdAt + posts[i].votesCount + posts[i].commentsNum > posts[i - 1].createdAt + posts[i - 1].votesCount + posts[i - 1].commentsNum) {
                successIncriteria = false;
                break;
            }
        }
        expect(res.statusCode).toBe(200);
        expect(posts.length).toBeGreaterThan(0);
        expect(successIncriteria).toBe(true);
    });
});



describe("GET /r/{subreddit}/best if not signed in", () => {
    it("should return all best posts from all subreddits ", async () => {
        const subreddit = 'tesla'
        const res = await request(app).get(`/r/${subreddit}/best`);
        const posts = res.body.posts;
        let successIncriteria = true;
        for (let i = 1; i < res.body.posts.length; i++) {
            if (posts[i].createdAt + posts[i].votesCount + posts[i].commentsNum > posts[i - 1].createdAt + posts[i - 1].votesCount + posts[i - 1].commentsNum) {
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



describe("GET /r/best if he is signed in", () => {
    /* in this test we will test the subreddits and users of the posts returned*/
    it("should return all best posts from all subreddits ", async () => {
        let token = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFR5cGUiOiJiYXJlIGVtYWlsIiwidXNlcm5hbWUiOiJ0Ml9uYWJpbDEiLCJpYXQiOjE2Njc5NDUyMjgsImV4cCI6MTY2Nzk0ODgyOH0.ipUlWcnp783qRn8X6yQaJBNKoChTREBXiTBC9GdbrNY';
        const res = await request(app).get("/r/best").set("Authorization", token);
        const posts = res.body.posts;
        let successIncriteria = true;
        let successInSubredditsAndUsers = true;
        const decoded = jwt.verify(token.split(' ')[1], "mozaisSoHotButNabilisTheHottest");
        const username = decoded.username;
        const user = await User.findById(username);
        const friends = user.friend;
        const subreddits = user.member.map((el) => {
            if (!el.isBanned)
                return el.communityId;
        })

        for (let i = 1; i < res.body.posts.length; i++) {
            if (posts[i].createdAt + posts[i].votesCount + posts[i].commentsNum > posts[i - 1].createdAt + posts[i - 1].votesCount + posts[i - 1].commentsNum) {
                successIncriteria = false;
                break;
            }
        }
        for (let i = 0; i < res.body.posts.length; i++) {
            if (subreddits.indexOf(posts[i].communityID) === -1 && friends.indexOf(posts[i].userID) === -1) {
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



describe("GET /r/{subreddit}/best if he is signed in", () => {
    /*this test is very similar ti its corresponding but sithout authentication */
    it("should return all best posts from all subreddits ", async () => {
        let token = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFR5cGUiOiJiYXJlIGVtYWlsIiwidXNlcm5hbWUiOiJ0Ml9uYWJpbDEiLCJpYXQiOjE2Njc5NDUyMjgsImV4cCI6MTY2Nzk0ODgyOH0.ipUlWcnp783qRn8X6yQaJBNKoChTREBXiTBC9GdbrNY';
        const subreddit = 'tesla'
        const res = await request(app).get(`/r/${subreddit}/best`).set('Authorization', token);
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
            if (posts[i].createdAt + posts[i].votesCount + posts[i].commentsNum > posts[i - 1].createdAt + posts[i - 1].votesCount + posts[i - 1].commentsNum) {
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
 * get: r/{subreddit}/hot
 * **************************************************************************************************************************************
 */

describe("GET /r/hot if not signed in", () => {
    it("should return all hot posts from all subreddits ", async () => {
        const res = await request(app).get("/r/hot");
        const posts = res.body.posts;
        let successIncriteria = true;
        for (let i = 1; i < res.body.posts.length; i++) {
            if (posts[i].createdAt * 2 + posts[i].votesCount + posts[i].commentsNum > posts[i - 1].createdAt * 2 + posts[i - 1].votesCount + posts[i - 1].commentsNum) {
                successIncriteria = false;
                break;
            }
        }
        expect(res.statusCode).toBe(200);
        expect(posts.length).toBeGreaterThan(0);
        expect(successIncriteria).toBe(true);
    });
});



describe("GET /r/{subreddit}/hot if not signed in", () => {
    it("should return all hot posts from all subreddits ", async () => {
        const subreddit = 'tesla'
        const res = await request(app).get(`/r/${subreddit}/hot`);
        const posts = res.body.posts;
        let successIncriteria = true;
        for (let i = 1; i < res.body.posts.length; i++) {
            if (posts[i].createdAt * 2 + posts[i].votesCount + posts[i].commentsNum > posts[i - 1].createdAt * 2 + posts[i - 1].votesCount + posts[i - 1].commentsNum) {
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



describe("GET /r/hot if he is signed in", () => {
    /* in this test we will test the subreddits and users of the posts returned*/
    it("should return all hot posts from all subreddits ", async () => {
        let token = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFR5cGUiOiJiYXJlIGVtYWlsIiwidXNlcm5hbWUiOiJ0Ml9uYWJpbDEiLCJpYXQiOjE2Njc5NDUyMjgsImV4cCI6MTY2Nzk0ODgyOH0.ipUlWcnp783qRn8X6yQaJBNKoChTREBXiTBC9GdbrNY';
        const res = await request(app).get("/r/hot").set("Authorization", token);
        const posts = res.body.posts;
        let successIncriteria = true;
        let successInSubredditsAndUsers = true;
        const decoded = jwt.verify(token.split(' ')[1], "mozaisSoHotButNabilisTheHottest");
        const username = decoded.username;
        const user = await User.findById(username);
        const friends = user.friend;
        const subreddits = user.member.map((el) => {
            if (!el.isBanned)
                return el.communityId;
        })

        for (let i = 1; i < res.body.posts.length; i++) {
            if (posts[i].createdAt * 2 + posts[i].votesCount + posts[i].commentsNum > posts[i - 1].createdAt * 2 + posts[i - 1].votesCount + posts[i - 1].commentsNum) {
                successIncriteria = false;
                break;
            }
        }
        for (let i = 0; i < res.body.posts.length; i++) {
            if (subreddits.indexOf(posts[i].communityID) === -1 && friends.indexOf(posts[i].userID) === -1) {
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



describe("GET /r/{subreddit}/hot if he is signed in", () => {
    /*this test is very similar ti its corresponding but sithout authentication */
    it("should return all hot posts from all subreddits ", async () => {
        let token = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFR5cGUiOiJiYXJlIGVtYWlsIiwidXNlcm5hbWUiOiJ0Ml9uYWJpbDEiLCJpYXQiOjE2Njc5NDUyMjgsImV4cCI6MTY2Nzk0ODgyOH0.ipUlWcnp783qRn8X6yQaJBNKoChTREBXiTBC9GdbrNY';
        const subreddit = 'tesla'
        const res = await request(app).get(`/r/${subreddit}/hot`).set('Authorization', token);
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
            if (posts[i].createdAt * 2 + posts[i].votesCount + posts[i].commentsNum > posts[i - 1].createdAt * 2 + posts[i - 1].votesCount + posts[i - 1].commentsNum) {
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
 * get: r/{subreddit}/top
 * **************************************************************************************************************************************
 */

describe("GET /r/top if not signed in", () => {
    it("should return all top posts from all subreddits ", async () => {
        const res = await request(app).get("/r/top");
        const posts = res.body.posts;
        let successIncriteria = true;
        for (let i = 1; i < res.body.posts.length; i++) {
            if (posts[i].votesCount > posts[i - 1].votesCount) {
                successIncriteria = false;
                break;
            }
        }
        expect(res.statusCode).toBe(200);
        expect(posts.length).toBeGreaterThan(0);
        expect(successIncriteria).toBe(true);
    });
});



describe("GET /r/{subreddit}/top if not signed in", () => {
    it("should return all top posts from all subreddits ", async () => {
        const subreddit = 'tesla'
        const res = await request(app).get(`/r/${subreddit}/top`);
        const posts = res.body.posts;
        let successIncriteria = true;
        for (let i = 1; i < res.body.posts.length; i++) {
            if (posts[i].votesCount > posts[i - 1].votesCount) {
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



describe("GET /r/top if he is signed in", () => {
    /* in this test we will test the subreddits and users of the posts returned*/
    it("should return all top posts from all subreddits ", async () => {
        let token = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFR5cGUiOiJiYXJlIGVtYWlsIiwidXNlcm5hbWUiOiJ0Ml9uYWJpbDEiLCJpYXQiOjE2Njc5NDUyMjgsImV4cCI6MTY2Nzk0ODgyOH0.ipUlWcnp783qRn8X6yQaJBNKoChTREBXiTBC9GdbrNY';
        const res = await request(app).get("/r/top").set("Authorization", token);
        const posts = res.body.posts;
        let successIncriteria = true;
        let successInSubredditsAndUsers = true;
        const decoded = jwt.verify(token.split(' ')[1], "mozaisSoHotButNabilisTheHottest");
        const username = decoded.username;
        const user = await User.findById(username);
        const friends = user.friend;
        const subreddits = user.member.map((el) => {
            if (!el.isBanned)
                return el.communityId;
        })

        for (let i = 1; i < res.body.posts.length; i++) {
            if (posts[i].votesCount > posts[i - 1].votesCount) {
                successIncriteria = false;
                break;
            }
        }
        for (let i = 0; i < res.body.posts.length; i++) {
            if (subreddits.indexOf(posts[i].communityID) === -1 && friends.indexOf(posts[i].userID) === -1) {
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



describe("GET /r/{subreddit}/top if he is signed in", () => {
    /*this test is very similar ti its corresponding but sithout authentication */
    it("should return all top posts from all subreddits ", async () => {
        let token = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFR5cGUiOiJiYXJlIGVtYWlsIiwidXNlcm5hbWUiOiJ0Ml9uYWJpbDEiLCJpYXQiOjE2Njc5NDUyMjgsImV4cCI6MTY2Nzk0ODgyOH0.ipUlWcnp783qRn8X6yQaJBNKoChTREBXiTBC9GdbrNY';
        const subreddit = 'tesla'
        const res = await request(app).get(`/r/${subreddit}/top`).set('Authorization', token);
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
 * get: r/{subreddit}/random
 * **************************************************************************************************************************************
 */

describe("GET /r/random if not signed in", () => {
    it("should return all random posts from all subreddits ", async () => {
        const res = await request(app).get("/r/random");
        const posts = res.body.posts;
        expect(res.statusCode).toBe(200);
        expect(posts.length).toBeGreaterThan(0);
    });
});



describe("GET /r/{subreddit}/random if not signed in", () => {
    it("should return all random posts from all subreddits ", async () => {
        const subreddit = 'tesla'
        const res = await request(app).get(`/r/${subreddit}/random`);
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



describe("GET /r/random if he is signed in", () => {
    /* in this test we will test the subreddits and users of the posts returned*/
    it("should return all random posts from all subreddits ", async () => {
        let token = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFR5cGUiOiJiYXJlIGVtYWlsIiwidXNlcm5hbWUiOiJ0Ml9uYWJpbDEiLCJpYXQiOjE2Njc5NDUyMjgsImV4cCI6MTY2Nzk0ODgyOH0.ipUlWcnp783qRn8X6yQaJBNKoChTREBXiTBC9GdbrNY';
        const res = await request(app).get("/r/random").set("Authorization", token);
        const posts = res.body.posts;
        let successIncriteria = true;
        let successInSubredditsAndUsers = true;
        const decoded = jwt.verify(token.split(' ')[1], "mozaisSoHotButNabilisTheHottest");
        const username = decoded.username;
        const user = await User.findById(username);
        const friends = user.friend;
        const subreddits = user.member.map((el) => {
            if (!el.isBanned)
                return el.communityId;
        })

        for (let i = 0; i < res.body.posts.length; i++) {
            if (subreddits.indexOf(posts[i].communityID) === -1 && friends.indexOf(posts[i].userID) === -1) {
                successInSubredditsAndUsers = false;
                break;
            }
        }
        expect(res.statusCode).toBe(200);
        expect(posts.length).toBeGreaterThan(0);
        expect(successInSubredditsAndUsers).toBe(true);
    });
});



describe("GET /r/{subreddit}/random if he is signed in", () => {
    /*this test is very similar ti its corresponding but sithout authentication */
    it("should return all random posts from all subreddits ", async () => {
        let token = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbFR5cGUiOiJiYXJlIGVtYWlsIiwidXNlcm5hbWUiOiJ0Ml9uYWJpbDEiLCJpYXQiOjE2Njc5NDUyMjgsImV4cCI6MTY2Nzk0ODgyOH0.ipUlWcnp783qRn8X6yQaJBNKoChTREBXiTBC9GdbrNY';
        const subreddit = 'tesla'
        const res = await request(app).get(`/r/${subreddit}/random`).set('Authorization', token);
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
