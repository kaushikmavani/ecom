const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    qty: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
});

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    items: [CartItemSchema],
    subTotal: {
        type: Number,
        required: true
    },
    finalAmount: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;