const mongoose = require('mongoose');
const Joi = require('joi');
const Color = require('../../models/Color');

class ColorController {

    static async getColors(req, res, next) {
        try {
            const page = req.query.page ?? 1;
            const limit = req.query.limit ?? 10;
            const offset = (page-1) * limit;

            const colors = await Color.find().sort('-_id').limit(limit).skip(offset);

            res.status(200).json({
                status: 1,
                data: colors
            });
        } catch (error) {
            res.status(500).json({
                status: 0,
                message: "Something went wrong, Please try again later."
            });
        }
    }

    static async getColor(req, res, next) {
        try {
            const color = await Color.findById(req.params.id);
            if(!color) {
                return res.status(400).json({
                    status: 0,
                    message: "Color not found, Please enter valid color id in url." 
                });
            }

            res.status(200).json({
                status: 1,
                data: color
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
                name: Joi.string().min(2).max(30).required(),
                code: Joi.string().min(6).max(6).required()
            });

            const { error, value } = await schema.validate({
                name: req.body.name,
                code: req.body.code
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

            const color = await Color.findOne({ name: req.body.name, code: req.body.code });
            if(color) {
                return res.status().json({
                    status: 0,
                    message: "Color is already exist with this name, Please enter unique color name."
                });
            }

            await Color.create({ name: req.body.name, code: req.body.code });

            await session.commitTransaction();

            res.status(201).json({
                status: 1,
                message: "Color created successfully!" 
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
                name: Joi.string().min(2).max(30).required(),
                code: Joi.string().min(6).max(6).required()
            });

            const { error, value } = await schema.validate({
                name: req.body.name,
                code: req.body.code
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

            const color = await Color.findById(req.params.id);
            if(!color) {
                return res.status(400).json({
                    status: 0,
                    message: "Color not found, Please enter valid color id in url." 
                });
            }

            const checkColor = await Color.findOne({ _id: { $ne: req.params.id }, name: req.body.name });
            if(checkColor) {
                return res.status(400).json({
                    status: 0,
                    message: "Color is already exist with this name, Please enter unique color name."
                });
            }

            await color.updateOne({ name: req.body.name, code: req.body.code });

            await session.commitTransaction();

            res.status(200).json({
                status: 1,
                message: "Color updated successfully!" 
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
            const color = await Color.findById(req.params.id);
            if(!color) {
                return res.status(400).json({
                    status: 0,
                    message: "Color not found, Please enter valid color id in url." 
                });
            }

            await color.deleteOne();

            await session.commitTransaction();

            res.status(200).json({
                status: 1,
                message: "Color deleted successfully!" 
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

module.exports = ColorController