const mongoose = require('mongoose');

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
    }
}, {
    timestamps: true,
    versionKey: false,
    JSON: { virtuals: true },
    toObject: { virtuals: true }
});

UserSchema.virtual('addresses', {
    ref: 'Address',
    localField: '_id',
    foreignField: 'user'
});

const User = mongoose.model('User', UserSchema);

module.exports = User