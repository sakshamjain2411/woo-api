import { getWishlist, addToWishlist, removeFromWishlist } from '../services/wishlist.service.js';

export const fetchWishlist = async (req, res, next) => {
  try {
    const items = await getWishlist(req.customer.id);
    res.json(items);
  } catch (err) {
    next(err);
  }
};

export const addWishlistItem = async (req, res, next) => {
  try {
    const productId = parseInt(req.body.productId, 10);
    if (isNaN(productId)) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'productId must be a valid number', status: 400 } });
    }
    const items = await addToWishlist(req.customer.id, productId);
    res.status(201).json(items);
  } catch (err) {
    next(err);
  }
};

export const removeWishlistItem = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    if (isNaN(productId)) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid productId', status: 400 } });
    }
    const items = await removeFromWishlist(req.customer.id, productId);
    res.json(items);
  } catch (err) {
    next(err);
  }
};
