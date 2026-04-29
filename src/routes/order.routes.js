import express from 'express';
import { listOrders, getOrder, placeOrder, updateOrderStatus } from '../controllers/order.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.get('/', listOrders);
router.get('/:id', getOrder);
router.post('/', placeOrder);
router.put('/:id', updateOrderStatus);

export default router;
