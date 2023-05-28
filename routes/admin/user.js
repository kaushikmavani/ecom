const express = require('express');
const UserController = require('../../controllers/admin/UserController');
const isAuthenticated = require('../../middlewares/auth');
const isAdmin = require('../../middlewares/adminGuard');

const routes = express.Router();

routes.put('/create', isAuthenticated, isAdmin, UserController.create);
routes.patch('/update/:id', isAuthenticated, isAdmin, UserController.update);
routes.delete('/delete/:id', isAuthenticated, isAdmin, UserController.delete);
routes.get('/:id', isAuthenticated, isAdmin, UserController.getUser);
routes.get('/', isAuthenticated, isAdmin, UserController.getUsers);

module.exports = routes;