/* eslint-disable */
const randomString = require("../utils/randomString");
const APIFeatures = require("../utils/api-features");
const dbConnect = require("../db-connection/connection");
User = require("../models/user-model");

jest.setTimeout(100000);

describe("Random string generator", () => {
  test("should respond with a 24 characters string", async () => {
    const res = randomString();
    expect(res.length).toBe(24);
  });
});

/*we will test the api features with virtual data represent tours for example and queryStr related to it*/

let queryStr = {};
let features = {};
beforeAll(() => {
  dbConnect();
  queryStr = {
    page: "1",
    limit: "2",
    sort: "karma",
    fields: "email,phoneNumber",
    karma: {
      gte: "0",
    },
  };
  features = new APIFeatures(User.find({}), queryStr);
});

describe("test the filter method", () => {
  it("should filter the query str from elements of (page,limit,sort) and edit the filters to be compatible with mongo", async () => {
    const filterRes = await features.filter().paginate().sort().selectFields()
      .query;
    /*should exclude page and sort and limit*/
    expect(filterRes.length).toBe(2);
    expect(filterRes).toStrictEqual(
      filterRes.sort((a, b) => {
        if (a.karma > b.karma) return 1;
        if (a.karma < b.karma) return -1;
        return 0;
      })
    );
    for (let i = 0; i < filterRes.length; i++) {
      expect(filterRes[i]).toHaveProperty("email");
      expect(filterRes[i]).toHaveProperty("phoneNumber");
    }
  });
});
