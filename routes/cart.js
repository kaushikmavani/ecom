const express = require('express');
const CartController = require('../controllers/CartController');
const isAuthenticated = require('../middlewares/auth');
const isUser = require('../middlewares/userGuard');

const routes = express.Router();

routes.put('/add-to-cart', isAuthenticated, isUser, CartController.addToCart);
routes.patch('/remove-from-cart', isAuthenticated, isUser, CartController.removeFromCart);
routes.patch('/add-qty', isAuthenticated, isUser, CartController.addQty);
routes.patch('/remove-qty', isAuthenticated, isUser, CartController.removeQty);
routes.delete('/clear', isAuthenticated, isUser, CartController.clearCart);
routes.get('/', isAuthenticated, isUser, CartController.getCart);

module.exports = routes