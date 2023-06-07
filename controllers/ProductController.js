const mongoose = require('mongoose');
const Joi = require('joi');
const User = require('../models/User');
const Product = require('../models/Product');
const Wishlist = require('../models/Wishlist');
const Compare = require('../models/Compare');

class ProductController {

    static async getProducts(req, res, next) {
        try {
            const page = req.query.page ?? 1;
            const limit = req.query.limit ?? 10;
            const offset = (page-1) * limit;

            const products = await Product.find().populate(['brand', 'color', 'size', 'category', 'subCategory']).sort('-_id').limit(limit).skip(offset);

            res.status(200).json({
                status: 1,
                data: products
            });
        } catch (error) {
            res.status(500).json({
                status: 0,
                message: "Something went wrong, Please try again later."
            });
        }
    }

    static async getProduct(req, res, next) {
        try {
            const product = await Product.findById(req.params.id).populate(['brand', 'color', 'size', 'category', 'subCategory']);
            if(!product) {
                return res.status(400).json({
                    status: 0,
                    message: "Product not found, Please enter valid product id in url."
                });
            }

            res.status(200).json({
                status: 1,
                data: product
            });
        } catch (error) {
            res.status(500).json({
                status: 0,
                message: "Something went wrong, Please try again later."
            });
        }
    }

    // wishlist
    static async addToWishlist(req, res, next) {
        const session = await mongoose.startSession();
        await session.startTransaction();
        try {
            const user = await User.findById(req.user._id);
            if(!user) {
                return res.status(400).json({
                    status: 0,
                    message: "Something went wrong, Please try again later."
                });
            }

            const product = await Product.findById(req.params.id);
            if(!product) {
                return res.status(400).json({
                    status: 0,
                    message: "Product not found, Please enter valid product id in url."
                });
            }

            const wishlist = await Wishlist.findOne({ user: user._id });
            if(wishlist) {
                if(wishlist.products.includes(product._id)) {
                    return res.status(400).json({
                        status: 0,
                        message: "Product has been already added in wishlist."
                    });
                }
                await wishlist.updateOne({ $push: { products: product._id } }, { session });
            } else {
                await Wishlist.create([{ user: user._id, products: [product._id] }], { session });
            }

            await session.commitTransaction();

            res.status(201).json({
                status: 1,
                message: "Product has been added into wishlist successfully!"
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

    static async removeToWishlist(req, res, next) {
        const session = await mongoose.startSession();
        await session.startTransaction();
        try {
            const user = await User.findById(req.user._id);
            if(!user) {
                return res.status(400).json({
                    status: 0,
                    message: "Something went wrong, Please try again later."
                });
            }

            const product = await Product.findById(req.params.id);
            if(!product) {
                return res.status(400).json({
                    status: 0,
                    message: "Product not found, Please enter valid product id in url."
                });
            }

            const wishlist = await Wishlist.findOne({ user: user._id });
            if(!wishlist || !wishlist.products.includes(product._id)) {
                return res.status(400).json({
                    status: 0,
                    message: "Product has been already removed from wishlist."
                });
            }

            await wishlist.updateOne({ $pull: { products: product._id } }, { session });

            const newWishlist = await Wishlist.findOne({ user: user._id }).session(session);
            if(!newWishlist.products.length) {
                await newWishlist.deleteOne({ session });
            }

            await session.commitTransaction();

            res.status(201).json({
                status: 1,
                message: "Product has been removed from wishlist successfully!"
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

    static async getWishlists(req, res, next) {
        try {
            const wishlist = await Wishlist.findOne({ user: req.user._id }).populate({ 
                path: 'products',
                populate: [
                    { path: 'brand', model: 'Brand' },
                    { path: 'color', model: 'Color' },
                    { path: 'size', model: 'Size' },
                    { path: 'category', model: 'Category' },
                    { path: 'subCategory', model: 'SubCategory' },
                ]
            }).select('products');
            
            res.status(200).json({
                status: 1,
                data: wishlist ?? []
            });
        } catch (error) {
            res.status(500).json({
                status: 0,
                message: "Something went wrong, Please try again later."
            });
        }
    }

    // compare
    static async addToCompare(req, res, next) {
        const session = await mongoose.startSession();
        await session.startTransaction();
        try {
            const user = await User.findById(req.user._id);
            if(!user) {
                return res.status(400).json({
                    status: 0,
                    message: "Something went wrong, Please try again later."
                });
            }

            const product = await Product.findById(req.params.id);
            if(!product) {
                return res.status(400).json({
                    status: 0,
                    message: "Product not found, Please enter valid product id in url."
                });
            }

            const compare = await Compare.findOne({ user: user._id });
            if(compare) {
                if(compare.products.includes(product._id)) {
                    return res.status(400).json({
                        status: 0,
                        message: "Product has been already added in compare."
                    });
                }
                await compare.updateOne({ $push: { products: product._id } }, { session });
            } else {
                await Compare.create([{ user: user._id, products: [product._id] }], { session });
            }

            await session.commitTransaction();

            res.status(201).json({
                status: 1,
                message: "Product has been added into compare successfully!"
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
    
    static async removeToCompare(req, res, next) {
        const session = await mongoose.startSession();
        await session.startTransaction();
        try {
            const user = await User.findById(req.user._id);
            if(!user) {
                return res.status(400).json({
                    status: 0,
                    message: "Something went wrong, Please try again later."
                });
            }

            const product = await Product.findById(req.params.id);
            if(!product) {
                return res.status(400).json({
                    status: 0,
                    message: "Product not found, Please enter valid product id in url."
                });
            }

            const compare = await Compare.findOne({ user: user._id });
            if(!compare || !compare.products.includes(product._id)) {
                return res.status(400).json({
                    status: 0,
                    message: "Product has been already removed from compare."
                });
            }

            await compare.updateOne({ $pull: { products: product._id } }, { session });

            const newCompare = await Compare.findOne({ user: user._id }).session(session);
            if(!newCompare.products.length) {
                await newCompare.deleteOne({ session });
            }

            await session.commitTransaction();

            res.status(201).json({
                status: 1,
                message: "Product has been removed from compare successfully!"
            });
        } catch (error) {
            console.log(error)
            await session.abortTransaction();
            res.status(500).json({
                status: 0,
                message: "Something went wrong, Please try again later."
            });
        } finally {
            await session.endSession();
        }
    }

    static async getCompareList(req, res, next) {
        try {
            const compare = await Compare.findOne({ user: req.user._id }).populate({ 
                path: 'products',
                populate: [
                    { path: 'brand', model: 'Brand' },
                    { path: 'color', model: 'Color' },
                    { path: 'size', model: 'Size' },
                    { path: 'category', model: 'Category' },
                    { path: 'subCategory', model: 'SubCategory' },
                ]
            }).select('products');
            
            res.status(200).json({
                status: 1,
                data: compare ?? []
            });
        } catch (error) {
            res.status(500).json({
                status: 0,
                message: "Something went wrong, Please try again later."
            });
        }
    }

}

module.exports = ProductController