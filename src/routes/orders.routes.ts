import express from 'express';
import { OrderController } from '../controllers/order.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/order', authMiddleware, OrderController.createOrder);
router.put('/order/:id', authMiddleware, OrderController.updateOrder);
router.get('/user/:id', authMiddleware, OrderController.getOrdersByUserId);

export default router;
