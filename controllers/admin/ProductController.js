const mongoose = require('mongoose');
const Joi = require('joi');
const Product = require('../../models/Product');
const Brand = require('../../models/Brand');
const Color = require('../../models/Color');
const Size = require('../../models/Size');
const Category = require('../../models/Category');
const SubCategory = require('../../models/SubCategory');

class ProductController {

    static async getProducts(req, res, next) {
        try {
            const page = req.query.page ?? 1;
            const limit = req.query.limit ?? 10;
            const offset = (page-1) * limit;
            
            const products = await Product.find().populate(['brand', 'color', 'size', 'category', 'subCategory']).sort('-_id').limit(limit).skip(offset);

            res.status(200).json({
                status: 1,
                data: products
            });
        } catch(error) {
            res.status(500).json({
                status: 0,
                message: "something went wrong, Please try again later."
            });
        }
    }

    static async getProduct(req, res, next) {
        try {
            const product = await Product.findById(req.params.id).populate(['brand', 'color', 'size', 'category', 'subCategory']);
            if(!product) {
                return res.status(400).json({
                    status: 0,
                    message: "Product not found, Please enter valid product id in url."
                });
            }

            res.status(200).json({
                status: 1,
                data: product
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
                brand: Joi.required(),
                color: Joi.required(),
                size: Joi.required(),
                category: Joi.required(),
                subCategory: Joi.required(),
                title: Joi.string().min(3).max(50).required(),
                description: Joi.string(),
                qty: Joi.number().required(),
                price: Joi.number().required()
            });

            const data = {
                brand: req.body.brand,
                color: req.body.color,
                size: req.body.size,
                category: req.body.category,
                subCategory: req.body.subCategory,
                title: req.body.title,
                description: req.body.description,
                qty: req.body.qty,
                price: req.body.price
            }

            const { error, value } = await schema.validate(data, {
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

            const brand = await Brand.findById(req.body.brand);
            if(!brand) {
                return res.status(400).json({
                    status: 0,
                    message: "Brand not found, Please enter valid brand id."
                });
            }

            const color = await Color.findById(req.body.color);
            if(!color) {
                return res.status(400).json({
                    status: 0,
                    message: "Color not found, Please enter valid color id."
                });
            }

            const size = await Size.findById(req.body.size);
            if(!size) {
                return res.status(400).json({
                    status: 0,
                    message: "Size not found, Please enter valid size id."
                });
            }

            const category = await Category.findById(req.body.category);
            if(!category) {
                return res.status(400).json({
                    status: 0,
                    message: "Category not found, Please enter valid category id."
                });
            }

            const subCategory = await SubCategory.findById(req.body.subCategory);
            if(!subCategory) {
                return res.status(400).json({
                    status: 0,
                    message: "Sub category not found, Please enter valid sub category id."
                });
            }

            await Product.create([ data ], { session });

            await session.commitTransaction();

            res.status(200).json({
                status: 1,
                message: "Product created successfully!"
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
                brand: Joi.required(),
                color: Joi.required(),
                size: Joi.required(),
                category: Joi.required(),
                subCategory: Joi.required(),
                title: Joi.string().min(3).max(50).required(),
                description: Joi.string(),
                qty: Joi.number().required(),
                price: Joi.number().required()
            });

            const data = {
                brand: req.body.brand,
                color: req.body.color,
                size: req.body.size,
                category: req.body.category,
                subCategory: req.body.subCategory,
                title: req.body.title,
                description: req.body.description,
                qty: req.body.qty,
                price: req.body.price
            }

            const { error, value } = await schema.validate(data, {
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

            const product = await Product.findById(req.params.id);
            if(!product) {
                return res.status(400).json({
                    status: 0,
                    message: "Product not found, Please enter valid product id in url."
                });
            }

            const brand = await Brand.findById(req.body.brand);
            if(!brand) {
                return res.status(400).json({
                    status: 0,
                    message: "Brand not found, Please enter valid brand id."
                });
            }

            const color = await Color.findById(req.body.color);
            if(!color) {
                return res.status(400).json({
                    status: 0,
                    message: "Color not found, Please enter valid color id."
                });
            }

            const size = await Size.findById(req.body.size);
            if(!size) {
                return res.status(400).json({
                    status: 0,
                    message: "Size not found, Please enter valid size id."
                });
            }

            const category = await Category.findById(req.body.category);
            if(!category) {
                return res.status(400).json({
                    status: 0,
                    message: "Category not found, Please enter valid category id."
                });
            }

            const subCategory = await SubCategory.findById(req.body.subCategory);
            if(!subCategory) {
                return res.status(400).json({
                    status: 0,
                    message: "Sub category not found, Please enter valid sub category id."
                });
            }

            await product.updateOne(data, { session });

            await session.commitTransaction();

            res.status(200).json({
                status: 1,
                message: "Product updated successfully!"
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
            const product = await Product.findById(req.params.id);
            if(!product) {
                return res.status(400).json({
                    status: 0,
                    message: "Product not found, Please enter valid product id in url."
                });
            }

            await Product.deleteOne({ session });

            await session.commitTransaction();

            res.status(200).json({
                status: 1,
                message: "Product deleted successfully!"
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

module.exports = ProductController