const Order = require('../../models/Order');
const Review = require('../../models/Review');

class OrderController {

    static async getOrders(req, res, next) {
        try {
            const page = req.query.page ?? 1;
            const limit = req.query.limit ?? 10;
            const offset = (page-1) * limit;

            const orders = await Order.find().populate([
                {
                    path: 'user',
                    select: '-password'
                },
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
                    path: 'user',
                    select: '-password'
                },
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

    static async getReviews(req, res, next) {
        try {
            const page = req.query.page ?? 1;
            const limit = req.query.limit ?? 10;
            const offset = (page-1) * limit;

            const reviews = await Review.find().populate('user', '-password').sort('-_id').limit(limit).skip(offset);

            res.status(200).json({
                status: 1,
                data: reviews
            });
        } catch (error) {
            return res.status(500).json({
                status: 0,
                message: "Something went wrong, Please try again later."
            });
        } 
    }

    static async getReview(req, res, next) {
        try {
            const reviews = await Review.findById(req.params.id).populate('user', '-password');

            res.status(200).json({
                status: 1,
                data: reviews
            });
        } catch (error) {
            return res.status(500).json({
                status: 0,
                message: "Something went wrong, Please try again later."
            });
        }
    }

}

module.exports = OrderController;