const express = require('express')
const authRoutes = require('./auth');
const brandRoutes = require('./brand');
const colorRoutes = require('./color');
const sizeRoutes = require('./size');
const categoryRoutes = require('./category');
const subCategoryRoutes = require('./subCategory');
const productRoutes = require('./product');

const routes = express.Router();

routes.use('/auth', authRoutes);
routes.use('/brands', brandRoutes);
routes.use('/colors', colorRoutes);
routes.use('/sizes', sizeRoutes);
routes.use('/categories', categoryRoutes);
routes.use('/sub-categories', subCategoryRoutes);
routes.use('/products', productRoutes);

module.exports = routes;