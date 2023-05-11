const express = require('express');
const AuthController = require('../../controllers/admin/AuthController');
const isAuthenticated = require('../../middlewares/auth');
const isAdmin = require('../../middlewares/adminGuard');

const routes = express.Router();

routes.post('/login', AuthController.login);
routes.post('/logout', isAuthenticated, isAdmin, AuthController.logout);

module.exports = routes;