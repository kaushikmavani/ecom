const Joi = require("joi");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

class CartController {

    static async getCart(req, res, next) {
        try {
            const cart = await Cart.findOne({ user: req.user._id }).populate({
                path: 'items',
                populate: {
                    path: 'product',
                    populate: ['brand', 'color', 'size', 'category', 'subCategory']
                }
            });
            if(!cart) {
                return res.status(200).json({
                    status: 1,
                    data: []
                });
            }

            res.status(200).json({
                status: 1,
                data: cart
            });
        } catch (error) {
            res.status(500).json({
                status: 0,
                message: "Something went wrong, Please try again later."
            });
        }
    }

    static async addToCart(req, res, next) {
        const session = await mongoose.startSession();
        await session.startTransaction();
        try {
            const schema = Joi.object({
                product: Joi.required(),
                qty: Joi.string().pattern(/^[0-9]+$/).required()
            });

            const { error, value } = schema.validate({
                product: req.body.product,
                qty: req.body.qty
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

            const product = await Product.findById(req.body.product);
            if(!product) {
                return res.status(400).json({
                    status: 0,
                    message: "Product not found, Please enter valid product id"
                });
            }

            if(product.qty < req.body.qty) {
                return res.status(400).json({
                    status: 0,
                    message: "You can not add qty more than stock in cart."
                });
            }

            const cart = await Cart.findOne({ user: req.user._id }).session(session);

            if(cart) {
                const cartItem = cart.items.find(item => item.product == product.id);
                if(cartItem) {
                    cart.items.id(cartItem._id).set({
                        qty: +cartItem.qty + +req.body.qty,
                        price: product.price,
                        amount: (+cartItem.qty + +req.body.qty) * product.price
                    });
                    await cart.save({ session });
                } else {
                    await cart.items.push({
                        product: product._id,
                        qty: req.body.qty,
                        price: product.price,
                        amount: req.body.qty * product.price
                    });
                    await cart.save({ session });
                }
                
                const subTotal = cart.items.reduce((total, item) => total += item.amount, 0);
                const finalAmount = cart.items.reduce((total, item) => total += item.amount, 0);

                await cart.updateOne({ subTotal, finalAmount }, { session });
            } else {
                await Cart.create([{
                    user: req.user._id,
                    items: [{
                        product: product._id,
                        qty: req.body.qty,
                        price: product.price,
                        amount: req.body.qty * product.price
                    }],
                    subTotal: req.body.qty * product.price,
                    finalAmount: req.body.qty * product.price
                }], { session });
            }

            await session.commitTransaction();

            res.status(201).json({
                status: 1,
                message: "Product has been added into cart successfully!"
            });
        } catch (error) {
            await session.abortTransaction();
            res.status(500).json({
                status: 0,
                message: "Somthing went wrong, Please try again later."
            });
        } finally {
            await session.endSession();
        }
    }

    static async removeFromCart(req, res, next) {
        const session = await mongoose.startSession();
        await session.startTransaction();
        try {
            const schema = Joi.object({
                product: Joi.required()
            });

            const { error, value } = schema.validate({
                product: req.body.product
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

            const cart = await Cart.findOne({ user: req.user._id }).session(session);
            if(!cart) {
                return res.status(400).json({
                    status: 0,
                    message: "Your cart is already empty."
                });
            }
        
            const cartItem = cart.items.find(item => item.product == req.body.product);
            if(!cartItem) {
                return res.status(400).json({
                    status: 0,
                    message: "Product is not already added into the cart."
                });
            }

            await cart.items.id(cartItem._id).deleteOne({ session });

            await cart.save({ session });

            if(cart.items.length) {
                const subTotal = cart.items.reduce((total, item) => total += item.amount, 0);
                const finalAmount = cart.items.reduce((total, item) => total += item.amount, 0);
    
                await cart.updateOne({ subTotal, finalAmount }, { session });
            } else {
                await cart.deleteOne({ session });
            }

            await session.commitTransaction();

            res.status(201).json({
                status: 1,
                message: "Product has been removed from cart successfully!"
            });
        } catch (error) {
            await session.abortTransaction();
            res.status(500).json({
                status: 0,
                message: "Somthing went wrong, Please try again later."
            });
        } finally {
            await session.endSession();
        }
    }

    static async addQty(req, res, next) {
        const session = await mongoose.startSession();
        await session.startTransaction();
        try {
            const schema = Joi.object({
                product: Joi.required()
            });

            const { error, value } = schema.validate({
                product: req.body.product
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

            const product = await Product.findById(req.body.product);
            if(!product) {
                return res.status(400).json({
                    status: 0,
                    message: "Product not found, Please enter valid product id"
                });
            }

            if(product.qty < req.body.qty) {
                return res.status(400).json({
                    status: 0,
                    message: "You can not add qty more than stock in cart."
                });
            }

            const cart = await Cart.findOne({ user: req.user._id }).session(session);
            if(!cart) {
                return res.status(400).json({
                    status: 0,
                    message: "Something went wrong, Please try again later."
                });
            }
        
            const cartItem = cart.items.find(item => item.product == req.body.product);
            if(!cartItem) {
                return res.status(400).json({
                    status: 0,
                    message: "Something went wrong, Please try again later."
                });
            }

            cart.items.id(cartItem._id).set({
                qty: +cartItem.qty + 1,
                price: product.price,
                amount: (+cartItem.qty + 1) * product.price
            });

            await cart.save({ session });

            const subTotal = cart.items.reduce((total, item) => total += item.amount, 0);
            const finalAmount = cart.items.reduce((total, item) => total += item.amount, 0);

            await cart.updateOne({ subTotal, finalAmount }, { session });

            await session.commitTransaction();

            res.status(200).json({
                status: 1,
                message: "Qty has been added successfully!"
            });
        } catch (error) {
            await session.abortTransaction();
            res.status(500).json({
                status: 0,
                message: "Somthing went wrong, Please try again later."
            });
        } finally {
            await session.endSession();
        }
    }

    static async removeQty(req, res, next) {
        const session = await mongoose.startSession();
        await session.startTransaction();
        try {
            const schema = Joi.object({
                product: Joi.required()
            });

            const { error, value } = schema.validate({
                product: req.body.product
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

            const product = await Product.findById(req.body.product);
            if(!product) {
                return res.status(400).json({
                    status: 0,
                    message: "Product not found, Please enter valid product id"
                });
            }

            if(product.qty < req.body.qty) {
                return res.status(400).json({
                    status: 0,
                    message: "You can not add qty more than stock in cart."
                });
            }

            const cart = await Cart.findOne({ user: req.user._id }).session(session);
            if(!cart) {
                return res.status(400).json({
                    status: 0,
                    message: "Something went wrong, Please try again later."
                });
            }
        
            const cartItem = cart.items.find(item => item.product == req.body.product);
            if(!cartItem) {
                return res.status(400).json({
                    status: 0,
                    message: "Something went wrong, Please try again later."
                });
            }

            cart.items.id(cartItem._id).set({
                qty: +cartItem.qty - 1,
                price: product.price,
                amount: (+cartItem.qty - 1) * product.price
            });

            await cart.save({ session });

            if(cart.items.id(cartItem._id).qty == 0) {
                cart.items.pull(cartItem._id);

                await cart.save({ session });
            }

            if(cart.items.length == 0) {
                await cart.deleteOne({ session });
            } else {
                const subTotal = cart.items.reduce((total, item) => total += item.amount, 0);
                const finalAmount = cart.items.reduce((total, item) => total += item.amount, 0);
    
                await cart.updateOne({ subTotal, finalAmount }, { session });
            }

            await session.commitTransaction();

            res.status(200).json({
                status: 1,
                message: "Qty has been removed successfully!"
            });
        } catch (error) {
            await session.abortTransaction();
            res.status(500).json({
                status: 0,
                message: "Somthing went wrong, Please try again later."
            });
        } finally {
            await session.endSession();
        }
    }

    static async clearCart(req, res, next) {
        const session = await mongoose.startSession();
        await session.startTransaction();
        try {
            const cart = await Cart.findOne({ user: req.user._id });
            if(!cart) {
                return res.status(400).json({
                    status: 0,
                    message: "Your cart is already empty."
                });
            }

            await cart.deleteOne({ session });

            await session.commitTransaction();

            res.status(200).json({
                status: 1,
                message: "Your cart is empty successfully!"
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

module.exports = CartController