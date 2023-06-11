const mongoose = require('mongoose');
const Joi = require('joi');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const config = require('../../config/appconfig');

class UserController {

    static async getUsers(req, res, next) {
        try {
            const page = req.query.page ?? 1;
            const limit = req.query.limit ?? 10;
            const offset = (page-1) * limit;

            const users = await User.find().populate('addresses').select('-password').sort('-_id').limit(limit).skip(offset);

            const response = users.map(user => {
                const userData = user.toObject();
                return { ...userData, addresses: userData.addresses };
            });
            
            res.status(200).json({
                status: 1,
                data: response
            });
        } catch (error) {
            res.status(500).json({
                status: 0,
                message: "Something went wrong, Please try again later."
            });
        }
    }

    static async getUser(req, res, next) {
        try {
            const user = await User.findById(req.params.id).populate('addresses').select('-password');
            if(!user) {
                return res.status(400).json({
                    status: 0,
                    message: "Something went wrong, please try again later."
                });
            }

            const userData = user.toObject();
            const response = { ...userData, addresses: userData.addresses };

            res.status(200).json({
                status: 1,
                data: response
            });
        } catch (error) {
            res.status(500).json({
                status: 0,
                message: "Something went wrong, please try again later."
            });
        }
    }

    static async create(req, res, next) {
        const session = await mongoose.startSession();
        await session.startTransaction();
        try {
            const schema = Joi.object({
                firstname: Joi.string().pattern(/^[a-zA-Z]{3,15}$/).required(),
                lastname: Joi.string().pattern(/^[a-zA-Z]{3,15}$/).required(),
                email: Joi.string().email({ minDomainSegments: 2 }).required(),
                password: Joi.string().min(6).max(30).required(),
                retypePassword: Joi.ref('password'),
                mobileNumber: Joi.string().pattern(/^[0-9]{10,10}$/)
            });

            const { error, value } = await schema.validate({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password,
                retypePassword: req.body.retypePassword,
                mobileNumber: req.body.mobileNumber
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

            const user = await User.findOne({ email: req.body.email });
            if(user) {
                return res.status(400).json({
                    status: 0,
                    message: "User already exists with this email, Please enter valid unique email address."
                });
            }

            const salt = bcrypt.genSaltSync(config.auth.bcryptSaltLength);
            const hash = bcrypt.hashSync(req.body.password, salt);

            await User.create([{
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: hash,
                mobileNumber: req.body.mobileNumber
            }], { session });

            await session.commitTransaction();

            res.status(201).json({
                status: 1,
                message: "User created successfully!"
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
                firstname: Joi.string().pattern(/^[a-zA-Z]{3,15}$/).required(),
                lastname: Joi.string().pattern(/^[a-zA-Z]{3,15}$/).required(),
                email: Joi.string().email({ minDomainSegments: 2 }).required(),
                password: Joi.string().min(6).max(30).required(),
                retypePassword: Joi.ref('password'),
                mobileNumber: Joi.string().pattern(/^[0-9]{10,10}$/)
            });

            const { error, value } = await schema.validate({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password,
                retypePassword: req.body.retypePassword,
                mobileNumber: req.body.mobileNumber
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

            const user = await User.findById(req.params.id);
            if(!user) {
                return res.status(400).json({
                    status: 0,
                    message: "User not found, Please enter valid user id in url." 
                });
            }

            const checkUser = await User.findOne({ _id: { $ne: req.params.id }, email: req.body.email });
            if(checkUser) {
                return res.status(400).json({
                    status: 0,
                    message: "User already exists with this email, Please enter valid unique email address."
                });
            }

            const salt = bcrypt.genSaltSync(config.auth.bcryptSaltLength);
            const hash = bcrypt.hashSync(req.body.password, salt);

            await user.updateOne({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: hash,
                mobileNumber: req.body.mobileNumber
            }, { session });

            await session.commitTransaction();

            res.status(200).json({
                status: 1,
                message: "User updated successfully!"
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
            const user = User.findById(req.params.id);
            if(!user) {
                return res.status(400).json({
                    status: 0,
                    message: "User not found, Please enter valid user id in url."
                });
            }

            await user.deleteOne({ session });

            await session.commitTransaction();

            res.status(200).json({
                status: 1,
                message: "User deleted successfully!"
            });
        } catch (error) {
            await session.abortTransaction();
            res.status(400).json({
                status: 0,
                message: "Something went wrong, Please try again later."
            });
        } finally {
            await session.endSession();
        }
    }

}

module.exports = UserController