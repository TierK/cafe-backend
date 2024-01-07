require('dotenv').config();
const jwtConfig = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.sendStatus(401).json({ message: 'No token provided' });
    }

    jwtConfig.verify(token, process.env.ACCESS_TOKEN, (err, response) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        res.locals = response;
        next();
    });

}

module.exports = {verifyToken: verifyToken};