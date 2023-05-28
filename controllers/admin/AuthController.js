const mongoose = require("mongoose");
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const Admin = require('../../models/Admin');
const bcrypt = require('bcryptjs');
const config = require('../../config/appconfig');
const Token = require("../../models/Token");

class AuthController {
    
    static async login(req, res, next) {
        const session = await mongoose.startSession();
        await session.startTransaction();
        try {
            const schema = Joi.object({
                email: Joi.string().email({ minDomainSegments: 2 }).required(),
                password: Joi.required()
            });

            const { error, value } = await schema.validate({
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

            const admin = await Admin.findOne({ email: req.body.email });
            if(!admin) {
                return res.status(400).json({
                    status: 0,
                    message: "Email is not exist in our data, Please enter valid email address."
                });
            }

            if(!bcrypt.compareSync(req.body.password, admin.password)) {
                return res.status(400).json({
                    status: 0,
                    message: "Your email and password must be match."
                });
            }

            const token = await jwt.sign({ _id: admin._id, email: admin.email, role: 'Admin' }, config.auth.jwtSecret, { expiresIn: config.auth.jwtExouresIn });

            const adminTokens = await Token.find({ auther: admin._id });
            if(adminTokens.length) {
                const deletableTokens = adminTokens.filter(singleToken => {
                    try {
                        const decoded = jwt.verify(singleToken, config.auth.jwtSecret);
                        if(decoded.exp < parseInt(Date.now() / 1000)) {
                            return true;
                        }
                    } catch (error) {
                        return true;
                    }
                    return false;
                });
                if(deletableTokens.length) {
                    await Token.deleteMany({ _id: deletableTokens.map(singleToken => singleToken._id) }, { session })
                }
            }

            await session.commitTransaction();

            res.status(200).json({
                status: 1,
                message: "You're logged in successfully!",
                token
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

    static async logout(req, res, next) {
        const session = await mongoose.startSession();
        await session.startTransaction();
        try {
            await Token.create({ token: req.token, auther: req.user._id, autherModel: req.user.role });

            await session.commitTransaction();
            res.status(200).json({
                status: 1,
                message: "You're logged out successfully!"
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

    static async profile(req, res, next) {
        try {
            const admin = await Admin.findById(req.user._id);
            if(!admin) {
                return res.status(400).json({
                    status: 0,
                    message: "Something went wrong, please try again later."
                });
            }

            res.status(200).json({
                status: 1,
                data: admin
            });
        } catch (error) {
            res.status(500).json({
                status: 0,
                message: "Something went wrong, Please try again later."
            });
        }
    }
}

module.exports = AuthController