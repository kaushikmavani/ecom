const express = require('express');
const authRoutes = require('./auth');
const userRoutes = require('./user');
const addressRoutes = require('./address');
const productRoutes = require('./product');
const cartRoutes = require('./cart');
const paymentRoutes = require('./payment');
const orderRoutes = require('./order');

const routes = express.Router();

routes.use('/auth', authRoutes);
routes.use('/users', userRoutes);
routes.use('/addresses', addressRoutes);
routes.use('/products', productRoutes);
routes.use('/cart', cartRoutes);
routes.use('/payments', paymentRoutes);
routes.use('/orders', orderRoutes);

module.exports = routes;