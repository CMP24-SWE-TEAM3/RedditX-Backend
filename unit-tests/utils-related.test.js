/* eslint-disable */
const randomString = require("../utils/randomString");

describe("Random string generator", () => {
  test("should respond with a 24 characters string", async () => {
    const res = randomString();
    expect(res.length).toBe(24);
  });
});
