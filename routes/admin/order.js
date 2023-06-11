const express = require('express');
const OrderController = require('../../controllers/admin/OrderController');
const isAuthenticated = require('../../middlewares/auth');
const isAdmin = require('../../middlewares/adminGuard');

const routes = express.Router();

routes.get('/reviews/:id', isAuthenticated, isAdmin, OrderController.getReview);
routes.get('/reviews', isAuthenticated, isAdmin, OrderController.getReviews);
routes.get('/:id', isAuthenticated, isAdmin, OrderController.getOrder);
routes.get('/', isAuthenticated, isAdmin, OrderController.getOrders);

module.exports = routes