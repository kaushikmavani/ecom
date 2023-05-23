const mongoose = require("mongoose");

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
    description: Text,
    Price: {
        type: Number,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false 
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;