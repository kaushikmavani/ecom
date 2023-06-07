require('dotenv').config();

const config = {
    app: {
        appName: process.env.APP_NAME,
        port: process.env.PORT || 3000
    },
    db: {
        mongoURL: process.env.MONGO_URL
    },
    auth: {
        jwtSecret: process.env.JWT_SECRET,
        jwtConfirmEmailSecret: process.env.JWT_CONFIRM_EMAIL_SECRET,
        jwtResetPasswordSecret: process.env.JWT_REESET_PASSWORD_SECRET,
        jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
        bcryptSaltLength: 10
    }
}

module.exports = config