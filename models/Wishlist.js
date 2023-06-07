const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    products: [{
        type: mongoose.Types.ObjectId,
        ref: 'Product'
    }]
    
}, {
    timestamps: true,
    versionKey: false
});

const Wishlist = mongoose.model('Wishlist', WishlistSchema);

module.exports = Wishlist