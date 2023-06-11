const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
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

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    items: [OrderItemSchema],
    subTotal: {
        type: Number,
        required: true
    },
    finalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    versionKey: false,
    JSON: { virtuals: true },
    toObject: { virtuals: true }
});

OrderSchema.virtual('review', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'order'
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order