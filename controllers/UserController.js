const mongoose = require('mongoose');
const User = require('../models/User');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const config = require('../config/appconfig');

class UserController {

    static async profile(req, res, next) {
        try {
            const user = await User.findOne({ _id: req.user._id }).select('-password');
            if(!user) {
                return res.status(400).json({
                    status: 0,
                    message: "Something went wrong, Please try again later."
                });
            }
            
            res.status(200).json({
                status: 1,
                data: user
            });
        } catch (error) {
            res.status(500).json({
                status: 0,
                message: "Something went wrong, Please try again later."
            });
        }
    }

    static async updateProfile(req, res, next) {
        const session = await mongoose.startSession();
        await session.startTransaction();
        try {
            const schema = Joi.object({
                firstname: Joi.string().pattern(/^[a-zA-Z]{3,15}$/).required(),
                lastname: Joi.string().pattern(/^[a-zA-Z]{3,15}$/).required(),
                mobileNumber: Joi.string().pattern(/^[0-9]{10,10}$/)
            });

            const { error, value } = schema.validate({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
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

            const user = await User.findOne({ _id: req.user._id });
            if(!user) {
                return res.status(400).json({
                    status: 0,
                    message: "Something went wrong, Please try again later."
                });
            }

            await user.updateOne({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                mobileNumber: req.body.mobileNumber
            }, { session });

            await session.commitTransaction();

            res.status(200).json({
                status: 1,
                message: "Profile updated successfully!"
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

    static async changePassword(req, res, next) {
        const session = await mongoose.startSession();
        await session.startTransaction();
        try {
            const schema = Joi.object({
                password: Joi.string().min(6).max(30).required(),
                newPassword: Joi.string().disallow(Joi.ref('password')).required(),
                retypeNewPassword: Joi.ref('newPassword'),
            });

            const { error, value } = schema.validate({
                password: req.body.password,
                newPassword: req.body.newPassword,
                retypeNewPassword: req.body.retypeNewPassword
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

            const user = await User.findOne({ _id: req.user._id });
            if(!user) {
                return res.status(400).json({
                    status: 0,
                    message: "Something went wrong, Please try again later."
                });
            }

            if(!bcrypt.compareSync(req.body.password, user.password)) {
                return res.status(400).json({
                    status: 0,
                    message: "Your password is wrong, Please enter your valid password."
                });
            }

            const salt = bcrypt.genSaltSync(config.auth.bcryptSaltLength);
            const hash = bcrypt.hashSync(req.body.newPassword, salt);

            await user.updateOne({ password: hash }, { session });

            await session.commitTransaction();

            res.status(200).json({
                status: 1,
                message: "Password changed successfully!"
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

module.exports = UserController