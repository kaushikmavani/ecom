const express = require('express');
const ColorController = require('../../controllers/admin/ColorController');
const isAuthenticated = require('../../middlewares/auth');
const isAdmin = require('../../middlewares/adminGuard');

const routes = express.Router();

routes.put('/create', isAuthenticated, isAdmin, ColorController.create);
routes.patch('/update/:id', isAuthenticated, isAdmin, ColorController.update);
routes.delete('/delete/:id', isAuthenticated, isAdmin, ColorController.delete);
routes.get('/:id', isAuthenticated, isAdmin, ColorController.getColor);
routes.get('/', isAuthenticated, isAdmin, ColorController.getColors);

module.exports = routes;