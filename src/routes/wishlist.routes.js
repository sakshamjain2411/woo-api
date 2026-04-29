import express from 'express';
import { fetchWishlist, addWishlistItem, removeWishlistItem } from '../controllers/wishlist.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.get('/', fetchWishlist);
router.post('/', addWishlistItem);
router.delete('/:productId', removeWishlistItem);

export default router;
