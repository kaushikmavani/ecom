const express = require('express');
const AuthController = require('../controllers/AuthController');
const isAuthenticated = require('../middlewares/auth');
const isUser = require('../middlewares/userGuard');

const routes = express.Router();

routes.post('/login', AuthController.login);
routes.post('/register', AuthController.register);
routes.post('/logout', isAuthenticated, isUser, AuthController.logout);
routes.post('/forgot-password', AuthController.forgotPassword);
routes.post('/reset-password', AuthController.resetPassword);

module.exports = routes;

