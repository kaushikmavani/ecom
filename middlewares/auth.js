const jwt = require('jsonwebtoken');
const Token = require('../models/Token');
const config = require('../config/appconfig');

module.exports = async (req, res, next) => {
    try {
        if(!req.headers.authorization) {
            return res.status(401).json({
                status: 0,
                message: "Unauthorized, Please enter valid token."
            });
        }

        const [ bearer, token ] = req.headers.authorization.split(' ');

        if(!bearer || bearer !== 'Bearer' || !token) {
            return res.status(401).json({
                status: 0,
                message: "Unauthorized, Please enter valid token."
            });
        }

        const logoutToken = await Token.findOne({ token });
        if(logoutToken) {
            return res.status(401).json({
                status: 0,
                message: "Unauthorized, Please enter valid token."
            });
        }

        jwt.verify(token, config.auth.jwtSecret, function(err, decoded) {
            if(err) {
                return res.status(401).json({
                    status: 0,
                    message: "Unauthorized, Please enter valid token."
                });
            } else {
                req.token = token
                req.user = decoded
            }
        });
        
        next();
    } catch (error) {
        res.status(500).json({
            status: 0,
            message: "Somthing went wrong, Please try again later."
        });
    }
}