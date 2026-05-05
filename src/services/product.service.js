import { woo } from '../config/woo.js';

export const fetchProducts = async (params = {}) => {
  const res = await woo.get('/products', {
    params: { per_page: 20, ...params }
  });
  return {
    data: res.data,
    total: parseInt(res.headers['x-wp-total'] ?? '0', 10),
    totalPages: parseInt(res.headers['x-wp-totalpages'] ?? '0', 10)
  };
};

export const fetchProductById = async (id) => {
  const res = await woo.get(`/products/${id}`);
  return res.data;
};

export const fetchProductsByIds = async (ids) => {
  if (!ids.length) return [];
  const res = await woo.get('/products', { params: { include: ids.join(','), per_page: ids.length } });
  return res.data;
};

export const fetchProductVariations = async (id) => {
  const res = await woo.get(`/products/${id}/variations`);
  return res.data;
};

const FILTER_ATTRIBUTES = ['pa_colour', 'pa_shape', 'pa_weight-range'];

export const fetchAttributes = async () => {
  const res = await woo.get('/products/attributes', { params: { per_page: 100 } });
  const attributes = res.data.filter(a => FILTER_ATTRIBUTES.includes(a.slug));

  const withTerms = await Promise.all(
    attributes.map(async (attr) => {
      const termsRes = await woo.get(`/products/attributes/${attr.id}/terms`, {
        params: { per_page: 100, orderby: 'count', order: 'desc' }
      });
      return {
        id: attr.id,
        name: attr.name,
        slug: attr.slug,
        terms: termsRes.data
          .filter(t => t.count > 0)
          .map(t => ({ id: t.id, name: t.name, slug: t.slug, count: t.count }))
      };
    })
  );

  return FILTER_ATTRIBUTES
    .map(slug => withTerms.find(a => a.slug === slug))
    .filter(Boolean);
};

export const fetchCategories = async () => {
  const res = await woo.get('/products/categories', { params: { per_page: 100 } });
  return res.data;
};
