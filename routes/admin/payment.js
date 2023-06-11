const express = require('express');
const PaymentController = require('../../controllers/admin/PaymentController');
const isAuthenticated = require('../../middlewares/auth');
const isAdmin = require('../../middlewares/adminGuard');

const routes = express.Router();

routes.get('/:id', isAuthenticated, isAdmin, PaymentController.getPayment);
routes.get('/', isAuthenticated, isAdmin, PaymentController.getPayments);

module.exports = routes