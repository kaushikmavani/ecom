const express = require('express');
const ProductController = require('../../controllers/admin/ProductController');
const isAuthenticated = require('../../middlewares/auth');
const isAdmin = require('../../middlewares/adminGuard');
const { uploadProduct } = require('../../middlewares/multer');

const routes = express.Router();

routes.put('/create', isAuthenticated, isAdmin, uploadProduct.single('image'), ProductController.create);
routes.patch('/update/:id', isAuthenticated, isAdmin, uploadProduct.single('image'), ProductController.update);
routes.delete('/delete/:id', isAuthenticated, isAdmin, ProductController.delete);
routes.get('/:id', isAuthenticated, isAdmin, ProductController.getProduct);
routes.get('/', isAuthenticated, isAdmin, ProductController.getProducts);

module.exports = routes;