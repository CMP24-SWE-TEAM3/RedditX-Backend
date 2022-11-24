/* eslint-disable */
const globalErrorHandler = require("../controllers/error-controller");

describe("handle cast error in DB", () => {
  test("should respond with an object.status = fail", () => {
    let error = {
      path: "_id",
      value: "fsdg4564",
    };
    const appError = globalErrorHandler.handleCastErrorDB(error);
    expect(appError.status).toBe("fail");
  });
});
describe("handle duplicate field in DB", () => {
  test("should respond with an object.status = fail", () => {
    let error = {
      keyValue: {
        name: "_id",
      },
    };
    const appError = globalErrorHandler.handleDuplicateFieldDB(error);
    expect(appError.status).toBe("fail");
  });
});
describe("handle validator error in DB", () => {
  test("should respond with an object.status = fail", () => {
    let error = {
      errors: [
        {
          val: {
            message: "the minimum length is 5 characters",
          },
        },
      ],
    };
    const appError = globalErrorHandler.handleValidatorErrorDB(error);
    expect(appError.status).toBe("fail");
  });
});
