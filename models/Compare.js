const mongoose = require('mongoose');

const CompareSchema = new mongoose.Schema({
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

const Compare = mongoose.model('Compare', CompareSchema);

module.exports = Compare