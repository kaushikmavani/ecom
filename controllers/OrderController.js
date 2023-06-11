const mongoose = require('mongoose');
const Joi = require('joi');
const Order = require('../models/Order');
const Review = require('../models/Review');

class OrderController {

    static async getOrders(req, res, next) {
        try {
            const page = req.query.page ?? 1;
            const limit = req.query.limit ?? 10;
            const offset = (page-1) * limit;

            const orders = await Order.find({ user: req.user._id }).populate([
                {
                    path: 'items',
                    populate: {
                        path: 'product',
                        populate: ['brand', 'size', 'color', 'category', 'subCategory']
                    }
                },
                {
                    path: 'review',
                    select: 'rating review'
                }
            ]).sort('-_id').limit(limit).skip(offset);

            const response = orders.map(order => {
                const orderData = order.toObject();
                return { ...orderData, review: orderData.review };
            });

            res.status(200).json({
                status: 1,
                data: response
            });
        } catch (error) {
            return res.status(500).json({
                status: 0,
                message: "Something went wrong, Please try again later."
            });
        } 
    }

    static async getOrder(req, res, next) {
        try {
            const order = await Order.findById(req.params.id).populate([
                {
                    path: 'items',
                    populate: {
                        path: 'product',
                        populate: ['brand', 'size', 'color', 'category', 'subCategory']
                    }
                },
                {
                    path: 'review',
                    select: 'rating review'
                }
            ]);

            const orderData = order.toObject();
            const response = { ...orderData, review: orderData.review };

            res.status(200).json({
                status: 1,
                data: response
            });
        } catch (error) {
            return res.status(500).json({
                status: 0,
                message: "Something went wrong, Please try again later."
            });
        }
    }

    static async addReview(req, res, next) {
        const session = await mongoose.startSession();
        await session.startTransaction();
        try {
            const schema = Joi.object({
                order: Joi.string().required(),
                rating: Joi.number().integer().min(1).max(5).required(),
                review: Joi.string().min(3).max(250).required()
            });

            const { error, value } = schema.validate({
                order: req.body.order,
                rating: req.body.rating,
                review: req.body.review
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

            const order = await Order.findById(req.body.order);
            if(!order) {
                return res.status(400).json({
                    status: 0,
                    message: "Order not found, Please enter valid order id."
                });
            }

            if(order.user != req.user._id) {
                return res.status(403).json({
                    status: 0,
                    message: "You can not add review on this order."
                });
            }

            if(order.status == 0) {
                return res.status(400).json({
                    status: 0,
                    message: "You can only add review on completed orders."
                });
            }

            const review = await Review.findOne({ user: req.user._id, order: req.body.order });
            if(review) {
                return res.status(400).json({
                    status: 0,
                    message: "You have already added review on this order."
                });
            }

            await Review.create([{
                user: req.user._id,
                order: order.id,
                rating: req.body.rating,
                review: req.body.review
            }], { session });

            await session.commitTransaction();

            res.status(201).json({
                status: 1,
                message: "Review created successfully!"
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

module.exports = OrderController;