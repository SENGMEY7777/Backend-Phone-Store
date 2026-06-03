const jwt = require('jsonwebtoken');
const jwtConfig = require('../configs/jwt');

const isLogin = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                result: false,
                message: 'Unauthorized'
            });
        }

        const parts = authHeader.split(' ');

        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({
                result: false,
                message: 'Invalid token format'
            });
        }

        const token = parts[1];

        const decode = jwt.verify(token, jwtConfig.secret);

        req.user = decode;

        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            result: false,
            message: 'Invalid or expired token'
        });
    }
};

module.exports = isLogin;
