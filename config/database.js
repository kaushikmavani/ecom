const mongoose = require('mongoose');
const config = require('./appconfig');

const mongooseConnect = (req, res, next) => {
    mongoose.connect(config.db.mongoURL)
        .then(() => {
            // console.log('✔ Database Connected!');
            next();
        })
        .catch((err) => {
            console.log('✘ MONGODB ERROR: ', err.message);
            next(err)
        });
}

module.exports = mongooseConnect