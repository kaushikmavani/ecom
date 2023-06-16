const express = require('express');
const UserController = require('../controllers/UserController');
const isAuthenticated = require('../middlewares/auth');
const isUser = require('../middlewares/userGuard');
const { uploadProfile } = require('../middlewares/multer');

const routes = express.Router();

routes.get('/profile', isAuthenticated, isUser, UserController.profile);
routes.patch('/profile/update', isAuthenticated, isUser, uploadProfile.single('avatar'), UserController.updateProfile);
routes.patch('/change-password', isAuthenticated, isUser, UserController.changePassword);

module.exports = routes