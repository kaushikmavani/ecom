const express = require('express');
const AuthController = require('../controllers/AuthController');

const routes = express.Router();

routes.get('/login', AuthController.login);

module.exports = routes;

