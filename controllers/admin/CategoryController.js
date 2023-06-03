const mongoose = require('mongoose');
const Joi = require('joi');
const Category = require('../../models/Category');

class CategoryController {

    static async getCategories(req, res, next) {
        try {
            const page = req.query.page ?? 1;
            const limit = req.query.limit ?? 10;
            const offset = (page-1) * limit;

            const categories = await Category.find().sort('-_id').limit(limit).skip(offset);

            res.status(200).json({
                status: 1,
                data: categories
            });
        } catch (error) {
            res.status(500).json({
                status: 0,
                message: "Something went wrong, Please try again later."
            });
        }
    }

    static async getCategory(req, res, next) {
        try {
            const category = await Category.findById(req.params.id);
            if(!category) {
                return res.status(400).json({
                    status: 0,
                    message: "Category not found, Please enter valid category id in url." 
                });
            }

            res.status(200).json({
                status: 1,
                data: category
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
                name: Joi.string().max(30).required()
            });

            const { error, value } = await schema.validate({
                name: req.body.name
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

            const category = await Category.findOne({ name: req.body.name });
            if(category) {
                return res.status().json({
                    status: 0,
                    message: "Category is already exist with this name, Please enter unique category name."
                });
            }

            await Category.create({ name: req.body.name });

            await session.commitTransaction();

            res.status(201).json({
                status: 1,
                message: "Category created successfully!" 
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
                name: Joi.string().max(30).required()
            });

            const { error, value } = await schema.validate({
                name: req.body.name
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

            const category = await Category.findById(req.params.id);
            if(!category) {
                return res.status(400).json({
                    status: 0,
                    message: "Category not found, Please enter valid category id in url." 
                });
            }

            const checkCategory = await Category.findOne({ _id: { $ne: req.params.id }, name: req.body.name });
            if(checkCategory) {
                return res.status(400).json({
                    status: 0,
                    message: "Category is already exist with this name, Please enter unique category name."
                });
            }

            await category.updateOne({ name: req.body.name });

            await session.commitTransaction();

            res.status(200).json({
                status: 1,
                message: "Category updated successfully!" 
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
            const category = await Category.findById(req.params.id);
            if(!category) {
                return res.status(400).json({
                    status: 0,
                    message: "Category not found, Please enter valid category id in url." 
                });
            }

            await category.deleteOne();

            await session.commitTransaction();

            res.status(200).json({
                status: 1,
                message: "Category deleted successfully!" 
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

module.exports = CategoryController