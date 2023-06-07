const express = require('express');
const PaymentController = require('../controllers/PaymentController');
const isAuthenticated = require('../middlewares/auth');
const isUser = require('../middlewares/userGuard');

const routes = express.Router();

routes.put('make-payment', isAuthenticated, isUser, PaymentController.makePayment);

module.exports = routes