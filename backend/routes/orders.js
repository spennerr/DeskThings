const express = require('express');
const db = require('../db');

const router = express.Router();
const ordersController = require('../controllers/ordersController');

router.get('/', ordersController.getOrderHistory);
router.get('/:id', ordersController.getOrderHistoryByCustomerId);

router.post('/create-order', ordersController.createOrder);


module.exports = router;