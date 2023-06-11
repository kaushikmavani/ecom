const mongoose = require('mongoose');
const Address = require('../models/Address');
const Joi = require('joi');

class AddressController {

    static async getAddresses(req, res, next) {
        try {
            const addresses = await Address.find({ user: req.user._id });

            res.status(200).json({
                status: 1,
                data: addresses
            });
        } catch (error) {
            res.status(500).json({
                status: 0,
                message: "Something went wrong, Please try again later."
            });
        }
    }

    static async getAddress(req, res, next) {
        try {
            const address = await Address.findById(req.params.id);
            if(!address) {
                return res.status(400).json({
                    status: 0,
                    message: "Address not found, Please enter valid address id in url."
                });
            }

            res.status(200).json({
                status: 1,
                data: address
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
                flatNo: Joi.string().required(),
                street1: Joi.string().min(3).max(250).required(),
                street2: Joi.string().min(3).max(250),
                pincode: Joi.string().pattern(/^[0-9]{6,6}$/).required(),
                city: Joi.string().required(),
                state: Joi.string().required(),
                country: Joi.string().required()
            });

            const data = {
                flatNo: req.body.flatNo,
                street1: req.body.street1,
                street2: req.body.street2,
                pincode: req.body.pincode,
                city: req.body.city,
                state: req.body.state,
                country: req.body.country
            };

            const { error, value } = schema.validate(data, {
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

            await Address.create([{ ...data, user: req.user._id }], { session });

            await session.commitTransaction();

            res.status(201).json({
                status: 1,
                message: "Address created successfully!"
            });
        } catch (error) {
            await session.abortTransaction();
            res.status(500).json({
                status: 1,
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
                flatNo: Joi.string().required(),
                street1: Joi.string().min(3).max(250).required(),
                street2: Joi.string().min(3).max(250),
                pincode: Joi.string().pattern(/^[0-9]{6,6}$/).required(),
                city: Joi.string().required(),
                state: Joi.string().required(),
                country: Joi.string().required()
            });

            const data = {
                flatNo: req.body.flatNo,
                street1: req.body.street1,
                street2: req.body.street2,
                pincode: req.body.pincode,
                city: req.body.city,
                state: req.body.state,
                country: req.body.country
            };

            const { error, value } = schema.validate(data, {
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

            const address = await Address.findById(req.params.id).session(session);
            if(!address) {
                return res.status(400).json({
                    status: 0,
                    message: "Address not found, Please enter valid address id in url."
                });
            }

            await address.updateOne({ ...data, user: req.user._id }, { session });

            await session.commitTransaction();

            res.status(201).json({
                status: 1,
                message: "Address updated successfully!"
            });
        } catch (error) {
            await session.abortTransaction();
            res.status(500).json({
                status: 1,
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
            const address = await Address.findById(req.params.id);
            if(!address) {
                return res.status(400).json({
                    status: 0,
                    message: "Address deleted successfully!"
                });
            }

            await address.deleteOne({ session });

            await session.commitTransaction();

            res.status(200).json({
                status: 1,
                message: "Address deleted successfully!"
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

module.exports = AddressController