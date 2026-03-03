const express = require('express');
const db = require('../db');

const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register-user', userController.registerUser);
router.post('/login', userController.loginUser);
//router.post('/me', userController.getUserInfo);
router.post('/me/orders', userController.getMyOrderHistory);

module.exports = router;