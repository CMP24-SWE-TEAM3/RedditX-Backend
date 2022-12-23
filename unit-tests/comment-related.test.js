/* eslint-disable */

const Comment = require("../models/comment-model");
const Post = require("../models/post-model");
const Community = require("../models/community-model");
const User = require("../models/user-model");
const CommentService = require("../services/comment-service");
const PostService = require("../services/post-service");
const validators = require("../validate/listing-validators");
const UserService = require("../services/user-service");
const userServiceInstance = new UserService(User);
const commentServiceInstance = new CommentService(Comment);
const postServiceInstance = new PostService(Post);
jest.setTimeout(1000000);

describe("testing spamComment service in comment service class", () => {
  describe("given a comment, spamType, spamText, and a username", () => {
    test("should not throw an error", async () => {
      var comment = new Comment({
        _id: "4564",
        textHTML: "hdfhdfh",
        textJSON: "hdfhdfh",
        spams: [],
        spamCount: 19,
      });
      comment = await commentServiceInstance.spamComment(
        comment,
        "Hateful Speeach",
        "jbkjvkj",
        "t2_moazHassan"
      );
      expect(comment.spamCount).toBe(20);
      expect(comment.spams[0].type).toBe("Hateful Speeach");
    });
  });
  describe("given a comment, spamType, spamText, and a username that spammed this comment before", () => {
    test("should throw an error", async () => {
      var comment = new Comment({
        _id: "4564",
        textHTML: "hdfhdfh",
        textJSON: "hdfhdfh",
        spams: [
          { userID: "t2_moazHassan", type: "Hateful Speeach", text: "jbkjvkj" },
        ],
        spamCount: 19,
      });
      expect(
        commentServiceInstance.spamComment(
          comment,
          "Hateful Speeach",
          "jbkjvkj",
          "t2_moazHassan"
        )
      ).rejects.toThrowError();
    });
  });
});

describe("testing saveSpammedComment service in comment service class", () => {
  describe("given a comment, and a community with spamCount < community.communityOptions.spamsNumBeforeRemove", () => {
    test("should not throw an error", async () => {
      var comment = new Comment({
        _id: "4564",
        textHTML: "hdfhdfh",
        textJSON: "hdfhdfh",
        spams: [],
        spamCount: 19,
      });
      const community = new Community({
        _id: "t5_imagePro235",
        communityOptions: {
          spamsNumBeforeRemove: 21,
        },
      });
      Comment.prototype.save = jest.fn().mockImplementation(() => { });
      expect(
        commentServiceInstance.saveSpammedComment(comment, community)
      ).resolves.not.toThrowError();
    });
  });
  describe("given a comment, and a community with spamCount >= community.communityOptions.spamsNumBeforeRemove", () => {
    test("should not throw an error", async () => {
      var comment = new Comment({
        _id: "4564",
        textHTML: "hdfhdfh",
        textJSON: "hdfhdfh",
        spams: [],
        spamCount: 21,
      });
      const community = new Community({
        _id: "t5_imagePro235",
        communityOptions: {
          spamsNumBeforeRemove: 21,
        },
      });
      Comment.prototype.save = jest.fn().mockImplementation(() => { });
      expect(
        commentServiceInstance.saveSpammedComment(comment, community)
      ).resolves.not.toThrowError();
    });
  });
});

describe("testing addComment service in comment service class", () => {
  describe("given a data and user", () => {
    test("should respond with a valid comment object", async () => {
      const data = {
        postID: "637becd453fc9fc3d423a1d4",
        textHTML: "This is a comment textHTML",
        textJSON: "This is a comment textJSON",
      };
      const user = new User({
        _id: "t2_moazMohamed",
      });
      const post = new Post({
        _id: "4564",
        title: "mnlknn",
        text: "hdfhdfh",
        communityID: "t5_imagePro235",
      });
      jest.spyOn(User, "findOne").mockImplementation(() => {
        return user;
      });
      jest.spyOn(Post, "findOne").mockImplementation(() => {
        return post;
      });
      Comment.prototype.save = jest
        .fn()
        .mockReturnValueOnce({
          postID: "637becd453fc9fc3d423a1d4",
          textHTML: "This is a comment textHTML",
          textJSON: "This is a comment textJSON",
          isRoot: true,
          authorId: "t2_moazMohamed",
          replyingTo: "637becd453fc9fc3d423a1d4",
          communityID: "t5_imagePro235",
          voters: [{ userID: "t2_moazMohamed", voteType: 1 }],
        });
      User.prototype.save = jest.fn().mockImplementation(() => {});
      Post.prototype.save = jest.fn().mockImplementation(() => {});
      const newComment = await commentServiceInstance.addComment(
        data,
        "t2_moazMohamed"
      );
      expect(newComment.textHTML).toBe("This is a comment textHTML");
    });
  });
});


describe("Test vote over post",()=>{
  test("test invalid id or dir", async () => {
    const body={
      "id":"63a4415d3df1c10771f2100b",
      "dir":""
    };
    const result = await commentServiceInstance.vote(body,"t2_lotfy2");
    expect(result.state).toBe(false);
    expect(result.error).toBe("invalid id or dir");
  });
  test("test invalid id or dir", async () => {
    const body={
      "id":"63a4415d3df1c10771f2100b",
      "dir":1
    };
    validators.validateVoteIn=jest.fn().mockReturnValue(false);

    const result = await commentServiceInstance.vote(body,"t2_lotfy2");
    expect(result.state).toBe(false);
    expect(result.error).toBe("invalid id or dir");
  });

  test("test post not found", async () => {
    const body={
      "id":"t3_63a4415d3df1c10771f2100b",
      "dir":1
    };
    validators.validateVoteIn=jest.fn().mockReturnValue(true);
    jest.spyOn(Post, "findOne").mockReturnValueOnce(null);      

    const result = await commentServiceInstance.vote(body,"t2_lotfy2");
    expect(result.state).toBe(false);
    expect(result.error).toBe("not found");
  });
  test("test voter not found and do invalid dir (0,2)", async () => {
      const body={
        "id":"t3_63a4415d3df1c10771f2100b",
        "dir":0
      };
      const post={"_id":"t3_63a4415d3df1c10771f2100b",
          "voters":[{"userID":"t2_nabil","voteType":1}]};
      validators.validateVoteIn=jest.fn().mockReturnValue(true);
      jest.spyOn(Post, "findOne").mockReturnValueOnce(post);      
      const result = await commentServiceInstance.vote(body,"t2_lotfy2");
      
      expect(result.state).toBe(false);
      expect(result.error).toBe("invalid dir");
  });

  test("test voter is found but do invalid dir (0,2)", async () => {
    const body={
      "id":"t3_63a4415d3df1c10771f2100b",
      "dir":-1
    };
    const post={"_id":"t3_63a4415d3df1c10771f2100b",
        "voters":[{"userID":"t2_lotfy2","voteType":-1}]};
    validators.validateVoteIn=jest.fn().mockReturnValue(true);
    jest.spyOn(Post, "findOne").mockReturnValueOnce(post);      
    const result = await commentServiceInstance.vote(body,"t2_lotfy2");
    
    expect(result.state).toBe(false);
    expect(result.error).toBe("already voted");
});
test("failed update of voter operation", async () => {
  const body={
    "id":"t3_63a4415d3df1c10771f2100b",
    "dir":-1
  };
  const post={"_id":"t3_63a4415d3df1c10771f2100b",
      "voters":[{"userID":"t2_lotfy2","voteType":1}]};
  validators.validateVoteIn=jest.fn().mockReturnValue(true);
  jest.spyOn(Post, "findOne").mockReturnValueOnce(post);      
  jest.spyOn(Post, "findByIdAndUpdate").mockRejectedValueOnce()      

  const result = await commentServiceInstance.vote(body,"t2_lotfy2");
  expect(result.status).toBe(false);
});

// test("success vote over a post", async () => {
//   const body={
//     "id":"t3_63a4415d3df1c10771f2100b",
//     "dir":-1
//   };
//   const post={"_id":"t3_63a4415d3df1c10771f2100b",
//       "voters":[{"userID":"t2_lotfy2","voteType":1}]};
//   validators.validateVoteIn=jest.fn().mockReturnValue(true);
//   jest.spyOn(Post, "findOne").mockReturnValueOnce(post);      
//   //postServiceInstance.findByIdAndUpdate=jest.fn().mockReturnValueOnce({});
//   jest.spyOn(Post, "findByIdAndUpdate").mockReturnValue({})      
//   jest.spyOn(User, "findOneAndUpdate").mockReturnValue({})      

//   User.findOneAndUpdate.clone=jest.fn().mockReturnValue({});

//   const result = await commentServiceInstance.vote(body,"t2_lotfy2");
//   console.log(result);
//   expect(result.state).toBe(true);
//   expect(result.status).toBe("done");

// });



test("test comment not found", async () => {
  const body={
    "id":"t1_63a4415d3df1c10771f2100b",
    "dir":1
  };
  validators.validateVoteIn=jest.fn().mockReturnValue(true);
  jest.spyOn(Comment, "findOne").mockReturnValueOnce(null);      

  const result = await commentServiceInstance.vote(body,"t2_lotfy2");
  expect(result.state).toBe(false);
  expect(result.error).toBe("not found");
});
test("test voter not found and do invalid dir (0,2)", async () => {
    const body={
      "id":"t1_63a4415d3df1c10771f2100b",
      "dir":0
    };
    const comment={"_id":"t1_63a4415d3df1c10771f2100b",
        "voters":[{"userID":"t2_nabil","voteType":1}]};
    validators.validateVoteIn=jest.fn().mockReturnValue(true);
    jest.spyOn(Comment, "findOne").mockReturnValueOnce(comment);      
    const result = await commentServiceInstance.vote(body,"t2_lotfy2");
    
    expect(result.state).toBe(false);
    expect(result.error).toBe("invalid dir");
});

test("test voter is found but do invalid dir (0,2)", async () => {
  const body={
    "id":"t1_63a4415d3df1c10771f2100b",
    "dir":-1
  };
  const comment={"_id":"t1_63a4415d3df1c10771f2100b",
      "voters":[{"userID":"t2_lotfy2","voteType":-1}]};
  validators.validateVoteIn=jest.fn().mockReturnValue(true);
  jest.spyOn(Comment, "findOne").mockReturnValueOnce(comment);      
  const result = await commentServiceInstance.vote(body,"t2_lotfy2");
  
  expect(result.state).toBe(false);
  expect(result.error).toBe("already voted");
});
test("failed update of voter operation", async () => {
const body={
  "id":"t1_63a4415d3df1c10771f2100b",
  "dir":-1
};
const comment={"_id":"t1_63a4415d3df1c10771f2100b",
    "voters":[{"userID":"t2_lotfy2","voteType":1}]};
validators.validateVoteIn=jest.fn().mockReturnValue(true);
jest.spyOn(Comment, "findOne").mockReturnValueOnce(comment);      
jest.spyOn(Comment, "findByIdAndUpdate").mockRejectedValueOnce()      

const result = await commentServiceInstance.vote(body,"t2_lotfy2");
console.log(result);
expect(result.state).toBe(false);
});
});

////////////////////////////////////////////
describe("testing deleteComment service in comment service class", () => {
  describe("given a comment", () => {
    test("should not throw an error", async () => {
      const comment = new Comment({
        _id: "4564",
        text: "hdfhdfh",
      });
      commentServiceInstance.getOne = jest
      .fn()
      .mockReturnValueOnce(comment);
      Comment.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        commentServiceInstance.deleteComment(comment)
      ).resolves.not.toThrowError();
    });
  });
  describe("given an invalid linkID", () => {
    test("should throw an error", async () => {
      Comment.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        commentServiceInstance.deleteComment(undefined)
      ).rejects.toThrowError();
    });
  });
});
////////////////////////////////////////////////
describe("testing addComment service in comment service class", () => {
  describe("given a data and user", () => {
    test("should respond with a valid comment object", async () => {
      const data = {
        postID: "637becd453fc9fc3d423a1d4",
        textHTML: "This is a comment textHTML",
        textJSON: "This is a comment textJSON",
      };
      const user = new User({
        _id: "t2_moazMohamed",
      });
      const post = new Post({
        _id: "637becd453fc9fc3d423a1d4",
        title: "mnlknn",
        text: "hdfhdfh",
        communityID: "t5_imagePro235",
      });
      jest.spyOn(User, "findOne").mockImplementation(() => {
        return user;
      });
      jest.spyOn(Post, "findOne").mockImplementation(() => {
        return post;
      });
      Comment.prototype.save = jest
        .fn()
        .mockReturnValueOnce({
          postID: "637becd453fc9fc3d423a1d4",
          textHTML: "This is a comment textHTML",
          textJSON: "This is a comment textJSON",
          isRoot: true,
          authorId: "t2_moazMohamed",
          replyingTo: "637becd453fc9fc3d423a1d4",
          communityID: "t5_imagePro235",
          voters: [{ userID: "t2_moazMohamed", voteType: 1 }],
        });
      User.prototype.save = jest.fn().mockImplementation(() => {});
      Post.prototype.save = jest.fn().mockImplementation(() => {});
      const newComment = await commentServiceInstance.addComment(
        data,
        "t2_moazMohamed"
      );
      expect(newComment.textHTML).toBe("This is a comment textHTML");
    });
  });
  describe("given invalid user & data", () => {
    test("should respond with an error", async () => {
      userServiceInstance.findById = jest
       .fn()
       .mockReturnValueOnce(undefined);
       postServiceInstance.findById = jest
       .fn()
       .mockReturnValueOnce(undefined);
      expect(
        commentServiceInstance.addComment(undefined, undefined)
      ).rejects.toThrowError();
    });
  });
});

// describe("testing addReply service in comment service class", () => {
//   describe("given a data and user", () => {
//     test("should respond with a valid reply object", async () => {
//       const data = {
//         postID: "637becd453fc9fc3d423a1d4",
//         textHTML: "This is a reply textHTML",
//         textJSON: "This is a reply textJSON",
//       };
//       const user = new User({
//         _id: "t2_moazMohamed",
//       });
//       const comment = new Comment({
//         _id: "637becd453fc9fc3d423a1d4",
//         text: "hdfhdfh"
//       });
//       jest.spyOn(User, "findOne").mockImplementation(() => {
//         return user;
//       });
//       jest.spyOn(Comment, "findOne").mockImplementation(() => {
//         return comment;
//       });
//       Comment.prototype.save = jest
//         .fn()
//         .mockReturnValueOnce({
//           postID: "637becd453fc9fc3d423a1d4",
//           textHTML: "This is a reply textHTML",
//           textJSON: "This is a reply textJSON",
//           isRoot: false,
//           authorId: "t2_moazMohamed",
//           replyingTo: "637becd453fc9fc3d423a1d4",
//           communityID: "t5_imagePro235",
//           voters: [{ userID: "t2_moazMohamed", voteType: 1 }],
//         });
//       User.prototype.save = jest.fn().mockImplementation(() => {});
//       Comment.prototype.save = jest.fn().mockImplementation(() => {});
//       const newReply = await commentServiceInstance.addReply(
//         data,
//         "t2_moazMohamed"
//       );
//       expect(newReply.textHTML).toBe("This is a reply textHTML");
//     });
//   });
//   describe("given invalid & data", () => {
//     test("should respond with an error", async () => {
//       userServiceInstance.findById = jest
//        .fn()
//        .mockReturnValueOnce(undefined);
//        commentServiceInstance.findById = jest
//        .fn()
//        .mockReturnValueOnce(undefined);
//       expect(
//         commentServiceInstance.addReply(undefined, undefined)
//       ).rejects.toThrowError();
//     });
//   });
// });

////////////////////////////////////////////
describe("testing deleteComment service in comment service class", () => {
  describe("given a comment", () => {
    test("should not throw an error", async () => {
      const comment = new Comment({
        _id: "4564",
        text: "hdfhdfh",
      });
      commentServiceInstance.getOne = jest
      .fn()
      .mockReturnValueOnce(comment);
      Comment.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        commentServiceInstance.deleteComment(comment)
      ).resolves.not.toThrowError();
    });
  });
  describe("given an invalid linkID", () => {
    test("should throw an error", async () => {
      Comment.prototype.save = jest.fn().mockImplementation(() => {});
      expect(
        commentServiceInstance.deleteComment(undefined)
      ).rejects.toThrowError();
    });
  });
});
////////////////////////////////////////////////
describe("testing addComment service in comment service class", () => {
  describe("given a data and user", () => {
    test("should respond with a valid comment object", async () => {
      const data = {
        postID: "637becd453fc9fc3d423a1d4",
        textHTML: "This is a comment textHTML",
        textJSON: "This is a comment textJSON",
      };
      const user = new User({
        _id: "t2_moazMohamed",
      });
      const post = new Post({
        _id: "637becd453fc9fc3d423a1d4",
        title: "mnlknn",
        text: "hdfhdfh",
        communityID: "t5_imagePro235",
      });
      jest.spyOn(User, "findOne").mockImplementation(() => {
        return user;
      });
      jest.spyOn(Post, "findOne").mockImplementation(() => {
        return post;
      });
      Comment.prototype.save = jest
        .fn()
        .mockReturnValueOnce({
          postID: "637becd453fc9fc3d423a1d4",
          textHTML: "This is a comment textHTML",
          textJSON: "This is a comment textJSON",
          isRoot: true,
          authorId: "t2_moazMohamed",
          replyingTo: "637becd453fc9fc3d423a1d4",
          communityID: "t5_imagePro235",
          voters: [{ userID: "t2_moazMohamed", voteType: 1 }],
        });
      User.prototype.save = jest.fn().mockImplementation(() => {});
      Post.prototype.save = jest.fn().mockImplementation(() => {});
      const newComment = await commentServiceInstance.addComment(
        data,
        "t2_moazMohamed"
      );
      expect(newComment.textHTML).toBe("This is a comment textHTML");
    });
  });
  describe("given invalid user & data", () => {
    test("should respond with an error", async () => {
      userServiceInstance.findById = jest
       .fn()
       .mockReturnValueOnce(undefined);
       postServiceInstance.findById = jest
       .fn()
       .mockReturnValueOnce(undefined);
      expect(
        commentServiceInstance.addComment(undefined, undefined)
      ).rejects.toThrowError();
    });
  });
});

// describe("testing addReply service in comment service class", () => {
//   describe("given a data and user", () => {
//     test("should respond with a valid reply object", async () => {
//       const data = {
//         postID: "637becd453fc9fc3d423a1d4",
//         textHTML: "This is a reply textHTML",
//         textJSON: "This is a reply textJSON",
//       };
//       const user = new User({
//         _id: "t2_moazMohamed",
//       });
//       const comment = new Comment({
//         _id: "637becd453fc9fc3d423a1d4",
//         text: "hdfhdfh"
//       });
//       jest.spyOn(User, "findOne").mockImplementation(() => {
//         return user;
//       });
//       jest.spyOn(Comment, "findOne").mockImplementation(() => {
//         return comment;
//       });
//       Comment.prototype.save = jest
//         .fn()
//         .mockReturnValueOnce({
//           postID: "637becd453fc9fc3d423a1d4",
//           textHTML: "This is a reply textHTML",
//           textJSON: "This is a reply textJSON",
//           isRoot: false,
//           authorId: "t2_moazMohamed",
//           replyingTo: "637becd453fc9fc3d423a1d4",
//           communityID: "t5_imagePro235",
//           voters: [{ userID: "t2_moazMohamed", voteType: 1 }],
//         });
//       User.prototype.save = jest.fn().mockImplementation(() => {});
//       Comment.prototype.save = jest.fn().mockImplementation(() => {});
//       const newReply = await commentServiceInstance.addReply(
//         data,
//         "t2_moazMohamed"
//       );
//       expect(newReply.textHTML).toBe("This is a reply textHTML");
//     });
//   });
//   describe("given invalid & data", () => {
//     test("should respond with an error", async () => {
//       userServiceInstance.findById = jest
//        .fn()
//        .mockReturnValueOnce(undefined);
//        commentServiceInstance.findById = jest
//        .fn()
//        .mockReturnValueOnce(undefined);
//       expect(
//         commentServiceInstance.addReply(undefined, undefined)
//       ).rejects.toThrowError();
//     });
//   });
// });


describe("testing showComment service in comment service class", () => {
  describe("given a comment", () => {
    let comments = [
      {
        _id: "123",
        isCollapsed: false,
      },
      {
        _id: "456",
        isCollapsed: true
      }
    ]
    test("show collapsed comment", async () => {
      commentServiceInstance.updateOne = jest.fn().mockImplementationOnce((filter, update) => {
        comments.forEach((element, index) => {
          if (element._id == filter._id)
            comments[index].isCollapsed = update.isCollapsed;
        });
      });
      commentServiceInstance.showComment('456');
      expect(comments[1].isCollapsed).toBe(false);
    });
    test("show already un collapsed comment", async () => {
      commentServiceInstance.updateOne = jest.fn().mockImplementationOnce((filter, update) => {
        comments.forEach((element, index) => {
          if (element._id == filter._id)
            comments[index].isCollapsed = update.isCollapsed;
        });
      });

      commentServiceInstance.showComment('123');
      expect(comments[0].isCollapsed).toBe(false);
    });

  });
});






describe("testing approve comment service in comment service class", () => {
  describe("given a comment", () => {
    let comments = [
      Comment({
        _id: "123",
        isDeleted: true,
        spams: [
          'heat speech'
        ],
        spamCount: 40,
      }),
      Comment({
        _id: "456",
        isDeleted: false,
        spams: [],
        spamCount: 0,
      })
    ];
    test("approve un deleted comment", async () => {
      Comment.prototype.save = jest.fn().mockImplementationOnce(() => { });
      commentServiceInstance.approveComment(comments[1]);
      expect(comments[1].isDeleted).toBe(false);
      expect(comments[1].spams.length).toBe(0);
      expect(comments[1].spamCount).toBe(0);
    });
    test("approve un deleted comment", async () => {
      Comment.prototype.save = jest.fn().mockImplementationOnce(() => { });
      commentServiceInstance.approveComment(comments[0]);
      expect(comments[0].isDeleted).toBe(false);
      expect(comments[0].spams.length).toBe(0);
      expect(comments[0].spamCount).toBe(0);
    });
  });
});
