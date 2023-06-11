const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
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
    status: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    versionKey: false
});

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment