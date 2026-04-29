import express from 'express';
import { listProducts, getProduct, getVariations, getCategories } from '../controllers/product.controller.js';

const router = express.Router();

router.get('/', listProducts);
router.get('/categories', getCategories);
router.get('/:id', getProduct);
router.get('/:id/variations', getVariations);

export default router;
