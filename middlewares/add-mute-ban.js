const addMute = (req, res, next) => {
    req.type = 'mute';
    next();
};

const addBan = (req, res, next) => {
    req.type = 'ban';
};

module.exports = {
    addBan,
    addMute,
} 