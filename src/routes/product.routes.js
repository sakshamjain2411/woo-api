import express from 'express';
import { fetchProducts } from '../services/product.service.js';
import { mapProduct } from '../utils/mapper.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const products = await fetchProducts(req.query);
    res.json(products.map(mapProduct));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

export default router;