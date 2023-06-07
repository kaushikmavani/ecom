const express = require('express');
const AddressController = require('../controllers/AddressController');
const isAuthenticated = require('../middlewares/auth');
const isUser = require('../middlewares/userGuard');

const routes = express.Router();

routes.put('/create', isAuthenticated, isUser, AddressController.create);
routes.patch('/update/:id', isAuthenticated, isUser, AddressController.update);
routes.delete('/delete/:id', isAuthenticated, isUser, AddressController.delete);
routes.get('/:id', isAuthenticated, isUser, AddressController.getAddress);
routes.get('/', isAuthenticated, isUser, AddressController.getAddresses);

module.exports = routes