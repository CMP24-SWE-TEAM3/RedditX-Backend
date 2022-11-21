/**
 * FILE: post-service
 * description: the services related to posts only
 * created at: 15/11/2022
 * created by: Mohamed Nabil
 * authors: Ahmed Lotfy, Shredan Abdullah, Moaz Mohamed, Mohamed Nabil
 */

const Service = require("./service");
const AppError = require("./../utils/app-error");

class PostService extends Service {
  constructor(model) {
    super(model);
  }

  addSortCriteria(criteria) {
    let sort = {};
    if (criteria) {
      if (criteria === "best")
        sort = {
          bestFactor: -1,
        };
      else if (criteria === "hot")
        sort = {
          hotnessFactor: -1,
        };
      else if (criteria === "new") {
        sort = {
          createdAt: -1,
        };
      } else if (criteria === "top")
        sort = {
          votesCount: -1,
        };
      else if (criteria === "random") {
        sort = {};
      } else {
        /*if the request has any other criteria */
        return new AppError("not found this page", 404);
      }
    }
    return sort;
  }

  getListingPosts = async (params, query, addedFilter) => {
    /*first of all : check if the request has certain subreddit or not*/
    let sort = this.addSortCriteria(params.criteria);
    /*if the request didn't contain limit in its query then will add it to the query with 10 at default */
    query.limit = query.limit || "10";
    /*return posts to controller */
    return await this.getAll(addedFilter, query).sort(sort); //addedFilter contain either the subreddit or the information of signedin user
  };

  getSearchResults = (query) => {
    const searchQuery = query.q;
    delete query.q;
    return this.getAll(
      {
        $or: [{ text: { $regex: searchQuery, $options: "i" } }],
      },
      query
    );
  };
}

module.exports = PostService;
