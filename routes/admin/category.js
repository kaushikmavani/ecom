const express = require('express');
const CategoryController = require('../../controllers/admin/CategoryController');
const isAuthenticated = require('../../middlewares/auth');
const isAdmin = require('../../middlewares/adminGuard');

const routes = express.Router();

routes.put('/create', isAuthenticated, isAdmin, CategoryController.create);
routes.patch('/update/:id', isAuthenticated, isAdmin, CategoryController.update);
routes.delete('/delete/:id', isAuthenticated, isAdmin, CategoryController.delete);
routes.get('/:id', isAuthenticated, isAdmin, CategoryController.getCategory);
routes.get('/', isAuthenticated, isAdmin, CategoryController.getCategories);

module.exports = routes;