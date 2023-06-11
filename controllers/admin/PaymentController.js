const Payment = require("../../models/Payment");

class PaymentCOntroller {

    static async getPayments(req, res, next) {
        try {
            const page = req.query.page ?? 1;
            const limit = req.query.limit ?? 10;
            const offset = (page-1) * limit;

            const payments = await Payment.find().populate([
                {
                    path: 'user',
                    select: '-password'
                },
                {
                    path: 'order',
                    populate: {
                        path: 'items',
                        populate: {
                            path: 'product',
                            populate: ['brand', 'color', 'size', 'category', 'subCategory']
                        }
                    }
                }
            ]).sort('-_id').limit(limit).skip(offset);

            res.status(200).json({
                status: 1,
                data: payments
            });
        } catch (error) {
            res.status(500).json({
                status: 0,
                message: "Something went wrong, Please try again later."
            });
        }
    }

    static async getPayment(req, res, next) {
        try {
            const payments = await Payment.findById(req.params.id).populate([
                {
                    path: 'user',
                    select: '-password'
                },
                {
                    path: 'order',
                    populate: {
                        path: 'items',
                        populate: {
                            path: 'product',
                            populate: ['brand', 'color', 'size', 'category', 'subCategory']
                        }
                    }
                }
            ]);

            res.status(200).json({
                status: 1,
                data: payments
            });
        } catch (error) {
            res.status(500).json({
                status: 0,
                message: "Something went wrong, Please try again later."
            });
        }
    }

}

module.exports = PaymentCOntroller