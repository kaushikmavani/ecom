const mongoose = require('mongoose');
const Joi = require('joi');
const SubCategory = require('../../models/SubCategory');
const Category = require('../../models/Category');

class SubCategoryController {

    static async getSubCategories(req, res, next) {
        try {
            const page = req.query.page ?? 1;
            const limit = req.query.limit ?? 10;
            const offset = (page-1) * limit;

            const subCategories = await SubCategory.find().populate('category').sort('-_id').limit(limit).skip(offset);

            res.status(200).json({
                status: 1,
                data: subCategories
            });
        } catch (error) {
            res.status(500).json({
                status: 0,
                message: "Something went wrong, Please try again later."
            });
        }
    }

    static async getSubCategory(req, res, next) {
        try {
            const subCategory = await SubCategory.findById(req.params.id).populate('category');
            if(!subCategory) {
                return res.status(400).json({
                    status: 0,
                    message: "Sub category not found, Please enter valid sub category id in url." 
                });
            }

            res.status(200).json({
                status: 1,
                data: subCategory
            });
        } catch (error) {
            res.status(500).json({
                status: 0,
                message: "Something went wrong, Please try again later."
            });
        }
    }

    static async create(req, res, next) {
        const session = await mongoose.startSession();
        await session.startTransaction();
        try {
            const schema = Joi.object({
                name: Joi.string().max(30).required(),
                category: Joi.required()
            });

            const { error, value } = await schema.validate({
                name: req.body.name,
                category: req.body.category
            }, {
                abortEarly: false
            });

            if(error) {
                const errors = {};
                error.details.forEach(err => errors[err.path] = err.message)
                return res.status(422).json({
                    status: 0,
                    data: errors
                });
            }

            const category = await Category.findById(req.body.category);
            if(!category) {
                return res.status(400).json({
                    status: 0,
                    message: "Category not found, Please enter valid category."
                });
            }

            const subCategory = await SubCategory.findOne({ name: req.body.name, category: req.body.category });
            if(subCategory) {
                return res.status(400).json({
                    status: 0,
                    message: "Sub category is already exist with this name, Please enter unique sub category name with category."
                });
            }

            await SubCategory.create([{ name: req.body.name, category: req.body.category }], { session });

            await session.commitTransaction();

            res.status(201).json({
                status: 1,
                message: "Sub category created successfully!" 
            });
            
        } catch (error) {
            await session.abortTransaction();
            res.status(500).json({
                status: 0,
                message: "Something went wrong, Please try again later."
            });

        } finally {
            await session.endSession();
        }
    }

    static async update(req, res, next) {
        const session = await mongoose.startSession();
        await session.startTransaction();
        try {
            const schema = Joi.object({
                name: Joi.string().max(30).required(),
                category: Joi.required()
            });

            const { error, value } = await schema.validate({
                name: req.body.name,
                category: req.body.category
            }, {
                abortEarly: false
            });

            if(error) {
                const errors = {};
                error.details.forEach(err => errors[err.path] = err.message)
                return res.status(422).json({
                    status: 0,
                    data: errors
                });
            }

            const subCategory = await SubCategory.findById(req.params.id);
            if(!subCategory) {
                return res.status(400).json({
                    status: 0,
                    message: "Sub category not found, Please enter valid sub category id in url." 
                });
            }

            const category = await Category.find({ _id: req.body.category });
            if(!category) {
                return res.status(400).json({
                    status: 0,
                    message: "Category not found, Please enter valid category."
                });
            }

            const checkSubCategory = await SubCategory.findOne({ _id: { $ne: req.params.id }, name: req.body.name, category: req.body.category });
            if(checkSubCategory) {
                return res.status(400).json({
                    status: 0,
                    message: "Sub category is already exist with this name, Please enter unique sub category name."
                });
            }

            await subCategory.updateOne({ name: req.body.name, category: req.body.category }, { session });

            await session.commitTransaction();

            res.status(200).json({
                status: 1,
                message: "Sub category updated successfully!" 
            });

        } catch (error) {
            await session.abortTransaction();
            res.status(500).json({
                status: 0,
                message: "Something went wrong, Please try again later."
            });

        } finally {
            await session.endSession();
        }
    }

    static async delete(req, res, next) {
        const session = await mongoose.startSession();
        await session.startTransaction();
        try {
            const subCategory = await SubCategory.findById(req.params.id);
            if(!subCategory) {
                return res.status(400).json({
                    status: 0,
                    message: "Sub category not found, Please enter valid sub category id in url." 
                });
            }

            await subCategory.deleteOne({ session });

            await session.commitTransaction();

            res.status(200).json({
                status: 1,
                message: "Sub category deleted successfully!" 
            });

        } catch (error) {
            await session.abortTransaction();
            res.status(500).json({
                status: 0,
                message: "Something went wrong, Please try again later."
            });

        } finally {
            await session.endSession();
        }
    }

}

module.exports = SubCategoryController