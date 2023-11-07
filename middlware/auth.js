const jwt = require('jsonwebtoken');
const config = require('../config/config');
const tokenBlacklist = new Set();
const verifyToken = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['authorization'] || req.get('Authorization');
    if (!token) {
        res.status(400).send({ success: false, msg: 'A token is required for authentication' })
    }

    try {
        const decode = jwt.verify(token.split(" ")[1], config.secret_jwt);
        req.user = decode;
        req._id = decode._id;

    } catch (error) {
        res.status(400).send({ success: false, msg: 'Invalid tokent' })
    }
    return next();
}

module.exports = verifyToken;