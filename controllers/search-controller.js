const UserService = require("./../services/user-service");
const PostService = require("./../services/post-service");
const CommentService = require("./../services/comment-service");
const CommunityService = require("./../services/community-service");
const User = require("./../models/user-model");
const Post = require("./../models/post-model");
const Comment = require("./../models/comment-model");
const Community = require("./../models/community-model");

const appError = require("./../utils/app-error");

/*make instances of the services of the services */
const userServiceInstance = new UserService(User);
const postServiceInstance = new PostService(Post);
const commentServiceInstance = new CommentService(Comment);
const communityServiceInstance = new CommunityService(Community);
/**
 * get search results
 * @param {function} (req,res,next)
 * @returns {object} res
 */
const getSearchResults = async (req, res, next) => {
  let results = [];
  if (req.query.type) {
    if (req.addedFilter) {
      req.query = { ...req.query, ...req.addedFilter };
    }
    const type = req.query.type;
    delete req.query.type;
    if (type === "user") {
      /**will get users that related to the search query */
      results = await userServiceInstance.getSearchResults(req.query, req.username);
    } else if (type === "sr") {
      /**will get subredits that related to the search query */
      results = await communityServiceInstance.getSearchResults(req.query);
    } else if (type === "post") {
      /**will get posts that related to the search query */
      results = await postServiceInstance.getSearchResults(req.query);
    } else if (type === "comment") {
      /**will get comments that related to the search query */
      results = await commentServiceInstance.getSearchResults(req.query);
    } else {
      return next(new appError("unvalid type in query"));
    }
  } else {
    return next(new appError("the search must have type in query"));
  }
  res.status(200).json({ results });
};

module.exports = {
  getSearchResults,
};
