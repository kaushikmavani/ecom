const mongoose = require("mongoose");
const path = require('path');
const rootDir = require('../utils/rootDir');

const productSchema = new mongoose.Schema({
    brand: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Brand'
    },
    color: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Color'
    },
    size: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Size'
    },
    category: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Category'
    },
    subCategory: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'SubCategory'
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true,
        get: v => {
            return v ? path.join(rootDir, 'public', 'images', 'upload', 'products', v) : null;
        }
    }
}, {
    timestamps: true,
    versionKey: false,
    toJSON: {
        getters: true
    },
    toObject: {
        getters: true
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;