const mongoose = require('mongoose');
const Joi = require('joi');
const Brand = require('../../models/Brand');

class BrandController {

    static async getBrands(req, res, next) {
        try {
            const page = req.query.page ?? 1;
            const limit = req.query.limit ?? 10;
            const offset = (page-1) * limit;

            const brands = await Brand.find().sort('-_id').limit(limit).skip(offset);

            res.status(200).json({
                status: 1,
                data: brands
            });
        } catch (error) {
            res.status(500).json({
                status: 0,
                message: "Something went wrong, Please try again later."
            });
        }
    }

    static async getBrand(req, res, next) {
        try {
            const brand = await Brand.findById(req.params.id);
            if(!brand) {
                return res.status(400).json({
                    status: 0,
                    message: "Brand not found, Please enter valid brand id in url." 
                });
            }

            res.status(200).json({
                status: 1,
                data: brand
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
                name: Joi.string().min(2).max(30).required()
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

            const brand = await Brand.findOne({ name: req.body.name });
            if(brand) {
                return res.status(400).json({
                    status: 0,
                    message: "Brand is already exist with this name, Please enter unique brand name."
                });
            }

            await Brand.create([{ name: req.body.name }], { session });

            await session.commitTransaction();

            res.status(201).json({
                status: 1,
                message: "Brand created successfully!" 
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
                name: Joi.string().min(2).max(30).required()
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

            const brand = await Brand.findById(req.params.id);
            if(!brand) {
                return res.status(400).json({
                    status: 0,
                    message: "Brand not found, Please enter valid brand id in url." 
                });
            }

            const checkBrand = await Brand.findOne({ _id: { $ne: req.params.id }, name: req.body.name });
            if(checkBrand) {
                return res.status(400).json({
                    status: 0,
                    message: "Brand is already exist with this name, Please enter unique brand name."
                });
            }

            await brand.updateOne({ name: req.body.name }, { session });

            await session.commitTransaction();

            res.status(200).json({
                status: 1,
                message: "Brand updated successfully!" 
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
            const brand = await Brand.findById(req.params.id);
            if(!brand) {
                return res.status(400).json({
                    status: 0,
                    message: "Brand not found, Please enter valid brand id in url." 
                });
            }

            await brand.deleteOne({ session });

            await session.commitTransaction();

            res.status(200).json({
                status: 1,
                message: "Brand deleted successfully!" 
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

module.exports = BrandController