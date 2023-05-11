const express = require('express');
const authRoutes = require('./auth');

const routes = express.Router();

routes.use('/auth', authRoutes);
routes.use('/brands', authRoutes);
routes.use('/colors', authRoutes);
routes.use('/sizes', authRoutes);
routes.use('/categories', authRoutes);
routes.use('/sub-categories', authRoutes);
routes.use('/products', authRoutes);

module.exports = routes;