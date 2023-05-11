const express = require('express');
const SizeController = require('../../controllers/admin/SizeController');
const isAuthenticated = require('../../middlewares/auth');
const isAdmin = require('../../middlewares/adminGuard');

const routes = express.Router();

routes.put('/create', isAuthenticated, isAdmin, SizeController.create);
routes.patch('/update/:id', isAuthenticated, isAdmin, SizeController.update);
routes.delete('/delete/:id', isAuthenticated, isAdmin, SizeController.delete);
routes.get('/:id', isAuthenticated, isAdmin, SizeController.getSize);
routes.get('/', isAuthenticated, isAdmin, SizeController.getSizes);

module.exports = routes;