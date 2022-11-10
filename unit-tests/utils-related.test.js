const APIFeatures = require('../utils/api-features');
const dbConnect = require('./../db-connection/connection');
User = require('./../models/user-model');
/*we will test the api features with virtual data represent tours for example and queryStr related to it*/

let queryStr = {};
let features = {};
beforeAll(() => {
    dbConnect();
    queryStr = {
        page: '2',
        limit: '5',
        sort: 'commentKarma',
        selectFields: 'email,phoneNumber',
        postKarma: {
            gte: '0'
        },

    }
    features = new APIFeatures(User.find({}), queryStr);
})


describe('test the filter method', () => {
    it('should filter the query str from elements of (page,limit,sort) and edit the filters to be compatible with mongo', async () => {
        const filterRes = await features.filter().paginate().sort().selectFields().query;
        /*should exclude page and sort and limit*/
        expect(filterRes.length).toBe(5);
        expect(filterRes).toStrictEqual(filterRes.sort((a, b) => {
            if (a.commentKarma > b.commentKarma)
                return 1;
            if (a.postKarma < b.postKarma)
                return -1;
            return 0;
        }));
        expect(filterRes).toHaveProperty('email');
        expect(filterRes).toHaveProperty('phoneNumber');

    })
})