const express = require('express')
const router = express.Router();
const OrderController = require('../controller/order.controller.js');

router.get('/', OrderController.getOrders);
router.get('/:orderID', OrderController.getOrder);
router.post('/', OrderController.createOrder);
router.put('/:orderID/:orderDate', OrderController.updateOrder);
router.delete('/:orderID', OrderController.deleteOrder);
router.get('/employee/:empID', OrderController.getOrdersByEmployee);

module.exports = router;