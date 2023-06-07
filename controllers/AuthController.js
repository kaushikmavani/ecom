const Joi = require("joi");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("../config/appconfig");
const User = require("../models/User");
const Token = require("../models/Token");
const jwt = require("jsonwebtoken");

class AuthController {
    
    static async login(req, res, next) {
        const session = await mongoose.startSession();
        await session.startTransaction();
        try {
            const schema = Joi.object({
                email: Joi.string().email({ minDomainSegments: 2 }).required(),
                password: Joi.string().min(6).max(30).required()
            });

            const { error, value } = schema.validate({
                email: req.body.email,
                password: req.body.password
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
            if(!user) {
                return res.status(400).json({
                    status: 0,
                    message: "Email is not exist in our data, Please enter valid email address."
                });
            }

            if(!user.emailVerified) {
                return res.status(400).json({
                    status: 0,
                    message: "Your email is not verified yet, First please check your mail and verify it."
                });
            }

            if(!bcrypt.compareSync(req.body.password, user.password)) {
                return res.status(400).json({
                    status: 0,
                    message: "Your email and password must be match."
                });
            }

            const token = await jwt.sign({ _id: user._id, email: user.email, role: 'User' }, config.auth.jwtSecret, { expiresIn: config.auth.jwtExpiresIn });

            const userTokens = await Token.find({ auther: user._id });
            if(userTokens.length) {
                const deletableTokens = userTokens.filter(singleToken => {
                    try {
                        const decoded = jwt.verify(singleToken, config.auth.jwtSecret);
                        if(decoded.exp < parseInt(Date.now() / 1000)) {
                            return true;
                        }
                    } catch(error) {
                        return true;
                    }
                    return false;
                })
                if(deletableTokens.length) {
                    await Token.deleteMany({ _id: deletableTokens.map(singleToken => singleToken._id)}, { session });
                }
            }

            await session.commitTransaction();

            res.status(200).json({
                status: 1,
                message: "You're logged in successfully!",
                token
            });
        } catch (error) {
            console.log(error)
            await session.abortTransaction();
            return res.status(500).json({
                status: 0,
                message: "Something went wrong, Please try again later."
            });
        } finally {
            await session.endSession();
        }
    }

    static async register(req, res, next) {
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

            const { error, value } = schema.validate({
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
                    message: "Email is already exist in our data, Please enter unique email address."
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
                message: "You're registered successfully!"
            });

        } catch (error) {
            await session.abortTransaction();
            return res.status(500).json({
                status: 0,
                message: "Something went wrong, Please try again later."
            });
        } finally {
            await session.endSession();
        }
    }

    static async logout(req, res, next) {
        const session = await mongoose.startSession();
        await session.startTransaction();
        try {
            const user = await User.findOne({ _id: req.user._id });
            if(!user) {
                return res.status(500).json({
                    status: 0,
                    message: "Something went wrong, Please try again later."
                });
            }

            await Token.create([{ token: req.token, auther: req.user._id, autherModel: req.user.role }], { session });

            await session.commitTransaction();

            res.status(200).json({
                status: 1,
                message: "You're logged out successfully!"
            });
        } catch (error) {
            await session.abortTransaction();
            return res.status(500).json({
                status: 0,
                message: "Something went wrong, Please try again later."
            });
        } finally {
            await session.endSession();
        }
    }

    static async forgotPassword(req, res, next) {}

    static async resetPassword(req, res, next) {}

}

module.exports = AuthController