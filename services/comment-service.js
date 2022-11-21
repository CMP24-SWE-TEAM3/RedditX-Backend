/**
 * FILE: comment-service
 * description: the services related to comments only
 * created at: 15/11/2022
 * created by: Mohamed Nabil
 * authors: Ahmed Lotfy, Shredan Abdullah, Moaz Mohamed, Mohamed Nabil
 */

const Service = require("./service");

class CommentService extends Service {
  constructor(model) {
    super(model);
  }
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

module.exports = CommentService;
