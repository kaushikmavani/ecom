const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
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
    mobileNumber: String
}, {
    timestamps: true,
    versionKey: false
});

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin