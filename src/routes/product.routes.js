import express from 'express';
import { listProducts, getProduct, getVariations, getCategories, getAttributes } from '../controllers/product.controller.js';

const router = express.Router();

router.get('/', listProducts);
router.get('/categories', getCategories);
router.get('/attributes', getAttributes);
router.get('/:id', getProduct);
router.get('/:id/variations', getVariations);

export default router;
