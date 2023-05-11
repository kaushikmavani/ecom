const express = require('express');
const SubCategoryController = require('../../controllers/admin/SubCategoryController');
const isAuthenticated = require('../../middlewares/auth');
const isAdmin = require('../../middlewares/adminGuard');

const routes = express.Router();

routes.put('/create', isAuthenticated, isAdmin, SubCategoryController.create);
routes.patch('/update/:id', isAuthenticated, isAdmin, SubCategoryController.update);
routes.delete('/delete/:id', isAuthenticated, isAdmin, SubCategoryController.delete);
routes.get('/:id', isAuthenticated, isAdmin, SubCategoryController.getCategory);
routes.get('/', isAuthenticated, isAdmin, SubCategoryController.getCategories);

module.exports = routes;