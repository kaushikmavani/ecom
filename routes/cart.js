const express = require('express');
const CartController = require('../controllers/CartController');
const isAuthenticated = require('../middlewares/auth');
const isUser = require('../middlewares/userGuard');

const routes = express.Router();

routes.put('add-to-cart', isAuthenticated, isUser, CartController.addToCart);
routes.delete('remove-to-cart/:id', isAuthenticated, isUser, CartController.removeToCart);
routes.patch('add-qty/:id', isAuthenticated, isUser, CartController.addQty);
routes.patch('remove-qty/:id', isAuthenticated, isUser, CartController.removeQty);
routes.get('/:id', isAuthenticated, isUser, CartController.getCartItemById);
routes.get('/', isAuthenticated, isUser, CartController.getCartList);

module.exports = routes