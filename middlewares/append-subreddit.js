/**
 * add subreddit to req if the path of the api has the certain subreddit
 * @param {Object} req the request comes from client and edited by previous middlewares eg. possible-auth-check and contain the username if the user is signed in
 * @param {Object} res the response that will be sent to the client or passed and in this function will passed to next middleware getPosts
 * @param {Function} next the faunction that call the next middleware in this case getPosts
 * @returns {void}
 */

module.exports = (req, res, next) => {
    if (req.params.subreddit)
        req.addedFilter = { communityID: req.params.subreddit };
    next();
};
