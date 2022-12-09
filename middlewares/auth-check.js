const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, "mozaisSoHotButNabilisTheHottest");
        req.username = decoded.username;
        console.log(req.username);
        next();
    } catch (error) {
        res.status(401).json({ message: "Auth failed!" });
    }
};