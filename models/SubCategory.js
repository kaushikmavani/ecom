const mongoose = require('mongoose');

const SubCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Category'
    }
}, {
    timestamps: true,
    versionKey: false
});

const SubCategory = mongoose.model('SubCategory', SubCategorySchema);

module.exports = SubCategory;