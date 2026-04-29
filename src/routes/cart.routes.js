import express from 'express';
import { fetchCart, addItem, updateItem, removeItem, emptyCart } from '../controllers/cart.controller.js';

const router = express.Router();

router.get('/', fetchCart);
router.post('/items', addItem);
router.put('/items/:key', updateItem);
router.delete('/items/:key', removeItem);
router.delete('/', emptyCart);

export default router;
