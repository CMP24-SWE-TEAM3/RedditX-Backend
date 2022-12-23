/* eslint-disable */
const Message = require("../models/message-model");
const MessageService = require("../services/message-service");

const messageServiceInstance = new MessageService(Message);


describe("Test message validation",()=>{
    test("test valid inputs", async () => {
        const body={
            "text":"hello",
            "subject":"CMP24",
            "fromID":"t2_nabil",
            "toID":"t2_moazMohamed"
        };
        const result = await messageServiceInstance.validateMessage(body);
        expect(result).toBe(true);

    });
    test("test invalid inputs", async () => {
        const body={
            "subject":"CMP24",
            "fromID":"t2_nabil",
            "toID":"t2_moazMohamed"
        };
        const result = await messageServiceInstance.validateMessage(body);
        expect(result).toBe(false);

    });

});


describe("Test compose a message",()=>{
    test("test", async () => {
        const body={
            "text":"hello",
            "subject":"CMP24",
            "fromID":"t2_nabil",
            "toID":"t2_moazMohamed"
        };
        messageServiceInstance.insert = jest.fn().mockReturnValueOnce({
           "_id":"6398f21234f17419013b954c"
          });
        const result = await messageServiceInstance.composeMessage(body);
        expect(result.status).toBe(true);
          
    });
    
});

describe("Test compose a message",()=>{
    test("test failed inssertion", async () => {
        const body={
            "text":"hello",
            "subject":"CMP24",
            "fromID":"t2_nabil",
            "toID":"t2_moazMohamed"
        };
        messageServiceInstance.insert = jest.fn().mockRejectedValueOnce();
          
        const result = await messageServiceInstance.composeMessage(body);
        console.log(result);
        expect(result.status).toBe(false);
          
    });
    
});


describe("Test delete a message",()=>{
    test("test message is not found", async () => {
        const body={
           "msgID":"6398f21234f17419013b954j"
        };
        messageServiceInstance.getOne=jest.fn().mockReturnValueOnce(null);
          
        const result = await messageServiceInstance.deleteMessage(body);
        expect(result.status).toBe(false);
        expect(result.error).toBe("invalid msgID");          
    });
    test("test failed update of valid message", async () => {
        const body={
           "msgID":"6398f21234f17419013b954a"
        };
        messageServiceInstance.getOne=jest.fn().mockReturnValueOnce({"_id":"6398f21234f17419013b954j"});
        messageServiceInstance.updateOne=jest.fn().mockRejectedValueOnce();

        const result = await messageServiceInstance.deleteMessage(body);
        expect(result.status).toBe(false);
        expect(result.error).toBe("operation failed");          
    });
    test("test success delete of a message", async () => {
        const body={
           "msgID":"6398f21234f17419013b954a"
        };
        messageServiceInstance.getOne=jest.fn().mockReturnValueOnce({"_id":"6398f21234f17419013b954a"});
        messageServiceInstance.updateOne=jest.fn().mockReturnValueOnce({"_id":"6398f21234f17419013b954a"});

        const result = await messageServiceInstance.deleteMessage(body);
        expect(result.status).toBe(true);
        expect(result.id).toBe("6398f21234f17419013b954a");          
    });
    
});

describe("test return sent messages of user",()=>{
    test("test failed of getting messages", async () => {
        messageServiceInstance.find=jest.fn().mockRejectedValueOnce();

        const result = await messageServiceInstance.sentMessages("t2_lotfy2");
        expect(result.status).toBe(false);
        expect(result.error).toBe("operation failed");          
 
    });
    test("test success of getting messages", async () => {
        messageServiceInstance.find=jest.fn().mockReturnValueOnce([{"_id":"test"},{"_id":"test2"}]);

        const result = await messageServiceInstance.sentMessages("t2_lotfy2");
        expect(result.status).toBe(true);
        expect(result.messages).toStrictEqual( [ { _id: 'test' }, { _id: 'test2' } ]);
    });
    
});

describe("test return inbox messages of user",()=>{
    test("test failed of getting messages", async () => {
        messageServiceInstance.find=jest.fn().mockRejectedValueOnce();

        const result = await messageServiceInstance.inboxMessages("t2_lotfy2");
        expect(result.status).toBe(false);
        expect(result.error).toBe("operation failed");          
 
    });
    test("test success of getting messages", async () => {
        messageServiceInstance.find=jest.fn().mockReturnValueOnce([{"_id":"test"},{"_id":"test2"}]);

        const result = await messageServiceInstance.inboxMessages("t2_lotfy2");
        expect(result.status).toBe(true);
        expect(result.messages).toStrictEqual( [ { _id: 'test' }, { _id: 'test2' } ]);
    });
    
});


describe("Test unread a message",()=>{
    test("test message is not found", async () => {
        const body={
           "msgID":"6398f21234f17419013b954j"
        };
        messageServiceInstance.getOne=jest.fn().mockReturnValueOnce(null);
          
        const result = await messageServiceInstance.unreadMessage(body);
        expect(result.status).toBe(false);
        expect(result.error).toBe("invalid msgID");          
    });
    test("test message is already unread", async () => {
        const body={
           "msgID":"6398f21234f17419013b954j"
        };
        messageServiceInstance.getOne=jest.fn().mockReturnValueOnce({"_id":"6398f21234f17419013b954j","unread_status":true});
          
        const result = await messageServiceInstance.unreadMessage(body);
        expect(result.status).toBe(false);
        expect(result.error).toBe("already unread");          
    });
    test("test failed update of valid message", async () => {
        const body={
           "msgID":"6398f21234f17419013b954a"
        };
        messageServiceInstance.getOne=jest.fn().mockReturnValueOnce({"_id":"6398f21234f17419013b954j"});
        messageServiceInstance.updateOne=jest.fn().mockRejectedValueOnce();

        const result = await messageServiceInstance.unreadMessage(body);
        expect(result.status).toBe(false);
        expect(result.error).toBe("operation failed");          
    });
    test("test success unread of a message", async () => {
        const body={
           "msgID":"6398f21234f17419013b954a"
        };
        messageServiceInstance.getOne=jest.fn().mockReturnValueOnce({"_id":"6398f21234f17419013b954a"});
        messageServiceInstance.updateOne=jest.fn().mockReturnValueOnce({"_id":"6398f21234f17419013b954a"});

        const result = await messageServiceInstance.unreadMessage(body);
        expect(result.status).toBe(true);
        expect(result.id).toBe("6398f21234f17419013b954a");          
    });
    
});

describe("Test reading all messages",()=>{
    test("test failed to find messages", async () => {
        const body={
           "msgID":"6398f21234f17419013b954a"
        };
        messageServiceInstance.find=jest.fn().mockRejectedValueOnce();

        const result = await messageServiceInstance.allMessages("t2_lotfy2");
        expect(result.status).toBe(false);
        expect(result.error).toBe("operation failed");          
    });
    test("test success reading all messages", async () => {
        const body={
           "msgID":"6398f21234f17419013b954a"
        };
        messageServiceInstance.find=jest.fn().mockReturnValueOnce([{"_id":"6398f21234f17419013b954a"}]);

        const result = await messageServiceInstance.allMessages(body);
        expect(result.status).toBe(true);
    });
    
});

