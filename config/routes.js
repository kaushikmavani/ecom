const express = require('express');
const adminRoutes = require('../routes/admin/index');
const userRoutes = require('../routes/index');

const routes = express.Router();

routes.use('/admin', adminRoutes);
routes.use('/', userRoutes);

module.exports = routes;