const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    auther: {
        type: mongoose.Types.ObjectId,
        required: true,
        refPath: 'autherModel'
    },
    autherModel: {
        type: String,
        required: true,
        enum: ['Admin', 'User']
    }
}, {
    versionKey: false
})

const Token = mongoose.model('Token', TokenSchema);

module.exports = Token