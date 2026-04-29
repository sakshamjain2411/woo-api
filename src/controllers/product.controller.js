import {
  fetchProducts,
  fetchProductById,
  fetchProductVariations,
  fetchCategories
} from '../services/product.service.js';
import { mapProduct } from '../utils/mapper.js';

export const listProducts = async (req, res, next) => {
  try {
    const { data, total, totalPages } = await fetchProducts(req.query);
    res.json({
      products: data.map(mapProduct),
      total: Number(total),
      totalPages: Number(totalPages),
      page: Number(req.query.page) || 1
    });
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await fetchProductById(req.params.id);
    res.json(mapProduct(product));
  } catch (err) {
    next(err);
  }
};

export const getVariations = async (req, res, next) => {
  try {
    const variations = await fetchProductVariations(req.params.id);
    res.json(variations.map(mapProduct));
  } catch (err) {
    next(err);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await fetchCategories();
    res.json(categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, count: c.count })));
  } catch (err) {
    next(err);
  }
};
