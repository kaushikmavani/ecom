const mongoose = require('mongoose');

const ColorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

const Color = mongoose.model('Color', ColorSchema);

module.exports = Color;