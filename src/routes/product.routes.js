import express from 'express';
import {
  listProducts,
  getProduct,
  getVariations,
  getCategories,
  getTags,
  getAttributes,
  multiFilterProducts,
  getAllProductNames,
} from '../controllers/product.controller.js';

const router = express.Router();

router.get('/names', getAllProductNames);
router.get('/multi-filter', multiFilterProducts);
router.get('/', listProducts);
router.get('/categories', getCategories);
router.get('/tags', getTags);
router.get('/attributes', getAttributes);
router.get('/:id', getProduct);
router.get('/:id/variations', getVariations);

export default router;
