import express from 'express';
import OrderController from '../controller/order.controller.js';

const router = express.Router();

router.get('/', OrderController.getOrders);
router.get('/:orderID', OrderController.getOrder);
router.post('/', OrderController.createOrder);
router.put('/:orderID/:orderDate', OrderController.updateOrder);
router.delete('/:orderID', OrderController.deleteOrder);
router.get('/employee/:empID', OrderController.getOrdersByEmployee);

export default router;