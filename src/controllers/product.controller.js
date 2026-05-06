import {
  fetchProducts,
  fetchProductById,
  fetchProductVariations,
  fetchCategories,
  fetchAttributes,
  fetchAllProductIdsByAttribute,
  fetchAllProductIdsByCategory,
  fetchProductsByIds,
} from '../services/product.service.js';
import { mapProduct } from '../utils/mapper.js';

export const listProducts = async (req, res, next) => {
  try {
    const { category, search, page, per_page, orderby, order, attribute, attribute_term } = req.query;
    const params = {};
    if (category)        params.category        = category;
    if (search)          params.search          = search;
    if (page)            params.page            = page;
    if (per_page)        params.per_page        = per_page;
    if (orderby)         params.orderby         = orderby;
    if (order)           params.order           = order;
    if (attribute)       params.attribute       = attribute;
    if (attribute_term)  params.attribute_term  = attribute_term;

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

export const getAttributes = async (req, res, next) => {
  try {
    const data = await fetchAttributes();
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

const FILTER_ATTRIBUTE_SLUGS = ['pa_colour', 'pa_shape', 'pa_weight-range'];

export const multiFilterProducts = async (req, res, next) => {
  try {
    const { category, page = '1', per_page = '20', ...rest } = req.query;
    const perPage = parseInt(per_page, 10);
    const pageNum = parseInt(page, 10);

    const activeAttributes = Object.entries(rest)
      .filter(([slug]) => FILTER_ATTRIBUTE_SLUGS.includes(slug));

    const idSets = await Promise.all(
      activeAttributes.map(([slug, termIds]) => fetchAllProductIdsByAttribute(slug, termIds))
    );

    let intersected = idSets.length > 0
      ? idSets.reduce((acc, ids) => acc.filter(id => ids.includes(id)))
      : [];

    if (category) {
      const categoryIds = await fetchAllProductIdsByCategory(category);
      intersected = intersected.filter(id => categoryIds.includes(id));
    }

    const total = intersected.length;
    const totalPages = total > 0 ? Math.ceil(total / perPage) : 0;
    const pageIds = intersected.slice((pageNum - 1) * perPage, pageNum * perPage);

    const data = await fetchProductsByIds(pageIds);
    res.json({ products: data.map(mapProduct), total, totalPages });
  } catch (err) {
    next(err);
  }
};
