/**
 * FILE: post-service
 * description: the services related to posts only
 * created at: 15/11/2022
 * created by: Mohamed Nabil
 * authors: Ahmed Lotfy, Shredan Abdullah, Moaz Mohamed, Mohamed Nabil
 */

const Service = require('./service');

class PostService extends Service {
    constructor(model) {
        super(model);
    }

    addSortCriteria(req) {
        let sort = {};
        if (req.params.criteria) {
            if (req.params.criteria === "best")
                sort = {
                    bestFactor: -1,
                };
            else if (req.params.criteria === "hot")
                sort = {
                    hotnessFactor: -1,
                };
            else if (req.params.criteria === "new") {
                sort = {
                    createdAt: -1,
                };
            } else if (req.params.criteria === "top")
                sort = {
                    votesCount: -1,
                };
            else if (req.params.criteria === "random") {
                sort = {};
            } else {
                /*if the request has any other criteria */
                return next(new AppError("not found this page", 404));
            }
        }
        return sort;
    }

    addLimit = (req) => {
        if (!req.query.limit)
            req.query.limit = '10';
        return req;
    }

    getListingPosts = async (req) => {
        /*first of all : check if the request has certain subreddit or not*/

        let sort = this.addSortCriteria(req);
        /*if the request didn't contain liit in its query then will add it to the query with 10 at default */
        req = this.addLimit(req);
        /*return posts to controller */
        return await this.getAll({}, req.query).sort(sort);
    }

    getSearchResults = (query) => {
        const searchQuery = query.q;
        delete query.q;
        return this.getAll({
            $or:
                [
                    { "text": { '$regex': searchQuery, '$options': 'i' } },
                ]
        }, query)
    }

}

module.exports = PostService;