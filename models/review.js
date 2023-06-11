const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    order: {
        type: mongoose.Types.ObjectId,
        required: true, 
        ref: 'Order'
    },
    rating: {
        type: Number,
        default: 0
    },
    review: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review