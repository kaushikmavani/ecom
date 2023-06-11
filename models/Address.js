const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    flatNo: {
        type: String,
        required: true
    },
    street1: {
        type: String,
        required: true
    },
    street2: String,
    pincode: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

const Addresss = mongoose.model('Address', AddressSchema);

module.exports = Addresss