import { woo } from '../config/woo.js';

export const fetchProducts = async (params = {}) => {
  const res = await woo.get('/products', {
    params: {
      per_page: 20,
      ...params
    }
  });
  return res.data;
};