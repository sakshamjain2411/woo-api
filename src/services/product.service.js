import { woo } from '../config/woo.js';

export const fetchProducts = async (params = {}) => {
  const res = await woo.get('/products', {
    params: { per_page: 20, ...params }
  });
  return { data: res.data, total: res.headers['x-wp-total'], totalPages: res.headers['x-wp-totalpages'] };
};

export const fetchProductById = async (id) => {
  const res = await woo.get(`/products/${id}`);
  return res.data;
};

export const fetchProductVariations = async (id) => {
  const res = await woo.get(`/products/${id}/variations`);
  return res.data;
};

export const fetchCategories = async () => {
  const res = await woo.get('/products/categories', { params: { per_page: 100 } });
  return res.data;
};
