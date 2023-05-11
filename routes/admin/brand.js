const express = require('express');
const BrandController = require('../../controllers/admin/BrandController');
const isAuthenticated = require('../../middlewares/auth');
const isAdmin = require('../../middlewares/adminGuard');

const routes = express.Router();

routes.put('/create', isAuthenticated, isAdmin, BrandController.create);
routes.patch('/update/:id', isAuthenticated, isAdmin, BrandController.update);
routes.delete('/delete/:id', isAuthenticated, isAdmin, BrandController.delete);
routes.get('/:id', isAuthenticated, isAdmin, BrandController.getBrand);
routes.get('/', isAuthenticated, isAdmin, BrandController.getBrands);

module.exports = routes;