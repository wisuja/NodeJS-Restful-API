const express = require("express");
const router = express.Router();

const UserController = require('../Controllers/users');
const checkAuth = require('../Middlewares/check_auth');

router.post('/signup', UserController.CreateUser);

router.post('/login', UserController.UserLogin)

router.delete('/:userId', checkAuth, UserController.DeleteUser)

module.exports = router;