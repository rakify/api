const jwt                        = require('jsonwebtoken');
require('dotenv').config();

module.exports = verifyAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token == null) return res.status(401).redirect('/login');

    try {
        const verified = jwt.verify(token, process.env.Secret_Key);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).redirect('/login');
    }
}