import {
  fetchProducts,
  fetchProductById,
  fetchProductVariations,
  fetchCategories
} from '../services/product.service.js';
import { mapProduct } from '../utils/mapper.js';

export const listProducts = async (req, res, next) => {
  try {
    const { category, search, page, per_page, orderby, order } = req.query;
    const params = {};
    if (category)  params.category  = category;
    if (search)    params.search    = search;
    if (page)      params.page      = page;
    if (per_page)  params.per_page  = per_page;
    if (orderby)   params.orderby   = orderby;
    if (order)     params.order     = order;

    const { data, total, totalPages } = await fetchProducts(params);
    res.json({ products: data.map(mapProduct), total, totalPages });
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const data = await fetchProductById(req.params.id);
    res.json(mapProduct(data));
  } catch (err) {
    next(err);
  }
};

export const getVariations = async (req, res, next) => {
  try {
    const data = await fetchProductVariations(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const data = await fetchCategories();
    res.json(data.map(c => ({ id: c.id, name: c.name, slug: c.slug, count: c.count })));
  } catch (err) {
    next(err);
  }
};
