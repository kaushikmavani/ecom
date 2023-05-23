const mongoose = require('mongoose');
const Joi = require('joi');

class ProductController {

    static async getProducts(req, res, next) {
        try {

        } catch(error) {
            res.status(500).json({
                status: 0,
                message: "something went wrong, Please try again later."
            });
        }
    }

}

module.exports = ProductController