const express = require('express');
const ProductController = require('../controllers/ProductController');
const isAuthenticated = require('../middlewares/auth');
const isUser = require('../middlewares/userGuard');

const routes = express.Router();

// compare
routes.patch('/compare/remove/:id', isAuthenticated, isUser, ProductController.removeToCompare);
routes.patch('/compare/add/:id', isAuthenticated, isUser, ProductController.addToCompare);
routes.get('/compare', isAuthenticated, isUser, ProductController.getCompareList);

// wishlist
routes.patch('/wishlist/remove/:id', isAuthenticated, isUser, ProductController.removeToWishlist);
routes.patch('/wishlist/add/:id', isAuthenticated, isUser, ProductController.addToWishlist);
routes.get('/wishlist', isAuthenticated, isUser, ProductController.getWishlists);

routes.get('/:id', isAuthenticated, isUser, ProductController.getProduct);
routes.get('/', isAuthenticated, isUser, ProductController.getProducts);

module.exports = routes