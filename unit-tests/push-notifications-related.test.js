
/* eslint-disable */
const PushNotificationService=require("../services/push-notifications-service");
const pushNotificationServiceInstance=new PushNotificationService();



describe("Test Send notifications using FCM",()=>{
    test("test sending notification", async () => {
        const message={
            "content":"hello"
        }
        pushNotificationServiceInstance.sendNotification=jest.fn().mockReturnValueOnce({"status":true,"message":"notification sent"});
        const result =await pushNotificationServiceInstance.sendNotification(message);
        expect(result.status).toBe(true);
    });
  
    test("test send new follower notification", async () => {
        
        pushNotificationServiceInstance.sendNotification=jest.fn().mockReturnValueOnce({"status":true,"message":"notification sent"});
        const result =await pushNotificationServiceInstance.newFollowerNotification("723894723894","t2_lotfy2");
        expect(result.status).toBe(true);
    });
    
    test("test failed send new follower notification", async () => {
        
        pushNotificationServiceInstance.sendNotification=jest.fn().mockReturnValueOnce({"status":false,"message":"notification sent"});
        const result =await pushNotificationServiceInstance.newFollowerNotification("723894723894","t2_lotfy2");
        console.log(result);
        expect(result.status).toBe(false);
    });
    test("test send upvote to a post notification", async () => {
        
        pushNotificationServiceInstance.sendNotification=jest.fn().mockReturnValueOnce({"status":true,"message":"notification sent"});
        const result =await pushNotificationServiceInstance.upvotePostNotification("723894723894","t2_lotfy2");
        console.log(result);
        expect(result.status).toBe(true);
    });
    test("test failed send upvote to a post notification", async () => {
        
        pushNotificationServiceInstance.sendNotification=jest.fn().mockReturnValueOnce({"status":false,"message":"notification sent"});
        const result =await pushNotificationServiceInstance.upvotePostNotification("723894723894","t2_lotfy2");
        console.log(result);
        expect(result.status).toBe(false);
    });
    test("test send upvote to a comment notification", async () => {
        
        pushNotificationServiceInstance.sendNotification=jest.fn().mockReturnValueOnce({"status":true,"message":"notification sent"});
        const result =await pushNotificationServiceInstance.upvoteCommentNotification("723894723894","t2_lotfy2");
        console.log(result);
        expect(result.status).toBe(true);
    });
    test("test failed send upvote to a comment notification", async () => {
        
        pushNotificationServiceInstance.sendNotification=jest.fn().mockReturnValueOnce({"status":false,"message":"notification sent"});
        const result =await pushNotificationServiceInstance.upvoteCommentNotification("723894723894","t2_lotfy2");
        console.log(result);
        expect(result.status).toBe(false);
    });
    test("test send mention notification", async () => {
        
        pushNotificationServiceInstance.sendNotification=jest.fn().mockReturnValueOnce({"status":true,"message":"notification sent"});
        const result =await pushNotificationServiceInstance.mentionNotification("723894723894","t2_lotfy2");
        console.log(result);
        expect(result.status).toBe(true);
    });
    test("test failed send mention notification", async () => {
        
        pushNotificationServiceInstance.sendNotification=jest.fn().mockReturnValueOnce({"status":false,"message":"notification sent"});
        const result =await pushNotificationServiceInstance.mentionNotification("723894723894","t2_lotfy2");
        console.log(result);
        expect(result.status).toBe(false);
    });
    test("test send reply to post notification", async () => {
        
        pushNotificationServiceInstance.sendNotification=jest.fn().mockReturnValueOnce({"status":true,"message":"notification sent"});
        const result =await pushNotificationServiceInstance.replytoPostNotification("723894723894","t2_lotfy2");
        console.log(result);
        expect(result.status).toBe(true);
    });
    test("test failed send reply to post notification", async () => {
        
        pushNotificationServiceInstance.sendNotification=jest.fn().mockReturnValueOnce({"status":false,"message":"notification sent"});
        const result =await pushNotificationServiceInstance.replytoPostNotification("723894723894","t2_lotfy2");
        console.log(result);
        expect(result.status).toBe(false);
    });
    test("test send reply to comment notification", async () => {
        
        pushNotificationServiceInstance.sendNotification=jest.fn().mockReturnValueOnce({"status":true,"message":"notification sent"});
        const result =await pushNotificationServiceInstance.replytoCommentNotification("723894723894","t2_lotfy2");
        console.log(result);
        expect(result.status).toBe(true);
    });
    test("test failed send reply to comment notification", async () => {
        
        pushNotificationServiceInstance.sendNotification=jest.fn().mockReturnValueOnce({"status":false,"message":"notification sent"});
        const result =await pushNotificationServiceInstance.replytoCommentNotification("723894723894","t2_lotfy2");
        console.log(result);
        expect(result.status).toBe(false);
    });


});

