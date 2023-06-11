const express = require('express');
const OrderController = require('../controllers/OrderController');
const isAuthenticated = require('../middlewares/auth');
const isUser = require('../middlewares/userGuard');

const routes = express.Router();

routes.put('/review/add', isAuthenticated, isUser, OrderController.addReview);
routes.get('/:id', isAuthenticated, isUser, OrderController.getOrder);
routes.get('/', isAuthenticated, isUser, OrderController.getOrders);

module.exports = routes