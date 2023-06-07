const mongoose = require('mongoose');
const Joi = require('joi');
const Size = require('../../models/Size');

class SizeController {

    static async getSizes(req, res, next) {
        try {
            const page = req.query.page ?? 1;
            const limit = req.query.limit ?? 10;
            const offset = (page-1) * limit;

            const sizes = await Size.find().sort('-_id').limit(limit).skip(offset);

            res.status(200).json({
                status: 1,
                data: sizes
            });
        } catch (error) {
            res.status(500).json({
                status: 0,
                message: "Something went wrong, Please try again later."
            });
        }
    }

    static async getSize(req, res, next) {
        try {
            const size = await Size.findById(req.params.id);
            if(!size) {
                return res.status(400).json({
                    status: 0,
                    message: "Size not found, Please enter valid size id in url." 
                });
            }

            res.status(200).json({
                status: 1,
                data: size
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

            const size = await Size.findOne({ name: req.body.name });
            if(size) {
                return res.status(400).json({
                    status: 0,
                    message: "Size is already exist with this name, Please enter unique size name."
                });
            }

            await Size.create([{ name: req.body.name }], { session });

            await session.commitTransaction();

            res.status(201).json({
                status: 1,
                message: "Size created successfully!" 
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

            const size = await Size.findById(req.params.id);
            if(!size) {
                return res.status(400).json({
                    status: 0,
                    message: "Size not found, Please enter valid size id in url." 
                });
            }

            const checkSize = await Size.findOne({ _id: { $ne: req.params.id }, name: req.body.name });
            if(checkSize) {
                return res.status(400).json({
                    status: 0,
                    message: "Size is already exist with this name, Please enter unique size name."
                });
            }

            await size.updateOne({ name: req.body.name }, { session });

            await session.commitTransaction();

            res.status(200).json({
                status: 1,
                message: "Size updated successfully!" 
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
            const size = await Size.findById(req.params.id);
            if(!size) {
                return res.status(400).json({
                    status: 0,
                    message: "Size not found, Please enter valid size id in url." 
                });
            }

            await size.deleteOne({ session });

            await session.commitTransaction();

            res.status(200).json({
                status: 1,
                message: "Size deleted successfully!" 
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

module.exports = SizeController