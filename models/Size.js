const mongoose = require('mongoose');

const SizeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true,
    versionKey: false
});

const Size = mongoose.model('Size', SizeSchema);

module.exports = Size;