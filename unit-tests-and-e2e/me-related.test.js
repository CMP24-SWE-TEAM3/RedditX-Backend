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
describe("User System",()=>{
  describe("test username about ",()=>{
      describe("username about",()=>{
        const username ="t2_hamada";
        test("should respond with 200 status code", async () => {
          const res = await request(app)
            .get(`/api/v1/me/about/${username}`)
            expect(res.statusCode).toBe(200);
        });
      });
      describe("username about",()=>{
        const username ="t2_hamada";
      test("should specify json in the content type header", async () => {
        const res = await request(app)
            .get(`/api/v1/me/about/${username}`)
            
        expect(res.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
      });
    });
    describe("username about",()=>{
      const username ="t2_hamada";
      test("should respond with a body that have a field called isBlocked to be equal false", async () => {
        const res = await request(app)
            .get(`/api/v1/me/about/${username}`)
            expect(res.body.data.isBlocked).toBe(false);
      });
    });
      describe("username about",()=>{
        const username ="t2_hamd";
        test("should respond with 404 status code", async () => {
          const res = await request(app)
            .get(`/api/v1/me/about/${username}`)
            
            expect(res.statusCode).toBe(404);
        });
  
      });
    });
  
  });

  describe("User System",()=>{
    describe("test username me info ",()=>{
        describe("username me info",()=>{
          const username ="t2_moazMohamed";
          test("should respond with 200 status code", async () => {
            const res = await request(app)
              .get(`/api/v1/me/${username}`)
              expect(res.statusCode).toBe(200);
          });
        });
        describe("username me info",()=>{
          const username ="t2_moazMohamed";
        test("should specify json in the content type header", async () => {
          const res = await request(app)
              .get(`/api/v1/me/${username}`)
              
          expect(res.headers["content-type"]).toEqual(
            expect.stringContaining("json")
          );
        });
      });
      describe("username me info",()=>{
        const username ="t2_moazMohamed";
        test("should respond with a body that have a field called emailCommentReply to be equal true", async () => {
          const res = await request(app)
              .get(`/api/v1/me/${username}`)
        
              expect(res.body.data.emailCommentReply).toBe(true);
        });
      });
        describe("username me info",()=>{
          const username ="t2_hamd";
          test("should respond with 404 status code", async () => {
            const res = await request(app)
              .get(`/api/v1/me/${username}`)
              
              expect(res.statusCode).toBe(404);
          });
    
        });
      });
    
    });
  describe("User System",()=>{
    describe("test username prefs",()=>{
        describe("username prefs",()=>{
          const username ="t2_hamada";
          test("should respond with 200 status code", async () => {
            const res = await request(app)
              .get(`/api/v1/me/prefs/${username}`)
              
              expect(res.statusCode).toBe(200);
          });
        });
        describe("username prefs",()=>{
          const username ="t2_hamada";
        test("should specify json in the content type header", async () => {
          const res = await request(app)
              .get(`/api/v1/me/prefs/${username}`)
              
          expect(res.headers["content-type"]).toEqual(
            expect.stringContaining("json")
          );
        });
      });
      describe("username prefs",()=>{
        const username ="t2_hamada";
        test("should respond with a body that have a field called emailPrivateMessage to be equal true", async () => {
          const res = await request(app)
              .get(`/api/v1/me/prefs/${username}`)
              expect(res.body.data.emailPrivateMessage).toBe(true);
        });
      });
        describe("username prefs",()=>{
          const username ="t2_hamd";
          test("should respond with 404 status code", async () => {
            const res = await request(app)
              .get(`/api/v1/me/pref/${username}`)
              
              expect(res.statusCode).toBe(404);
          });
    
        });
    
    });
    });
