const mongoose = require('mongoose');
const path = require('path');
const rootDir = require('../utils/rootDir');

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobileNumber: String,
    emailVerified: {
        type: Number,
        default: 0
    },
    avatar: {
        type: String,
        get: v => {
            return v ? path.join(rootDir, 'public', 'images', 'upload', 'avatars', v) : null;
        }
    }
}, {
    timestamps: true,
    versionKey: false,
    toJSON: { 
        virtuals: true,
        getters: true
    },
    toObject: { 
        virtuals: true,
        getters: true
    }
});

UserSchema.virtual('addresses', {
    ref: 'Address',
    localField: '_id',
    foreignField: 'user'
});

const User = mongoose.model('User', UserSchema);

module.exports = User