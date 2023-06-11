const mongoose = require('mongoose');
const Joi = require('joi');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Product = require('../models/Product');

class PaymentController {

    static async makePayment(req, res, next) {
        const session = await mongoose.startSession();
        await session.startTransaction();
        try {
            const schema = Joi.object({
                cart: Joi.string().required(),
                amount: Joi.string().required(),
                status: Joi.number().integer().required()
            });

            const { error, value } = schema.validate({
                cart: req.body.cart,
                amount: req.body.amount, 
                status: req.body.status
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

            if(req.body.status == 1) {

                const cart = await Cart.findById(req.body.cart).session(session);
                if(!cart) {
                    return res.status(400).json({
                        status: 0,
                        message: "Cart not found, Please enter valid cart id."
                    });
                }

                if(cart.items.length == 0) {
                    return res.status(400).json({
                        status: 0,
                        message: "Please enter at least one item into cart for payment."
                    });
                }

                if(cart.finalAmount != req.body.amount) {
                    return res.status(400).json({
                        status: 0,
                        message: "Payment failed, Please verify your payment details."
                    });
                }

                const isVerified = await PaymentController.verifyForPayment(cart);
                if(!isVerified) {
                    return res.status(400).json({
                        status: 0,
                        message: "Some products are out of stock, Please check your cart before payment."
                    });
                }

                const order = await Order.create([{
                    user: req.user._id,
                    items: cart.items,
                    subTotal: cart.subTotal,
                    finalAmount: cart.finalAmount
                }], { session });

                await Payment.create([{
                    user: req.user._id,
                    order: order._id,
                    status: 1
                }], { session });

                await Promise.all(cart.items.map(async item => {
                    const product = await Product.findById(item.product).session(session);
                    await product.updateOne({ qty: product.qty - item.qty }, { session });
                }));

                await cart.deleteOne({ session });

            } else {
                return res.status(400).json({
                    status: 0,
                    message: "Payment failed, Please verify your payment details."
                });
            }

            await session.commitTransaction();

            res.status(200).json({
                status: 1,
                message: "Payment has been successfully!"
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

    static async verifyForPayment(cart) {
        const notAvailableProdcuts = await Promise.all(cart.items.map(async item => {
            const product = await Product.findById(item.product);
            if(!product || (item.qty > product.qty)) return item;
            return null;
        }));
    
        const notValidProducts = notAvailableProdcuts.filter(product => product != null);

        if(notValidProducts.length) return false;
        return true;
    }

}

module.exports = PaymentController