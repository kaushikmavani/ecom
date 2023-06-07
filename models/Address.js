const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    
}, {
    timestamps: true,
    versionKey: false
});

const Addresss = mongoose.model('Address', AddressSchema);

module.exports = Addresss