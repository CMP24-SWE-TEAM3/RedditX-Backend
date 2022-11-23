const jwt = require("jsonwebtoken");



/**
 * the function that is reponsible for the username if he is signed in 
 * @param {Object}req the request that comes from client and it conatins authorization in it then will add th username to req if it isn't will but it with null and call next 
 * @param {Object}res the res that will passed to next function and will sent to the client
 * @param {Function}next the function that will call to move to the next middleware eg. addSubreddt
 */
module.exports = (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, "mozaisSoHotButNabilisTheHottest");
            req.username = decoded.username;
            next();
        } else {
            req.headers.authorization = null;
            next();
        }
    } catch (error) {
        res.status(401).json({ message: "Auth failed!" });
    }
};
