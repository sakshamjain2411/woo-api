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
    const { productId } = req.body;
    if (productId == null) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'productId is required', status: 400 } });
    }
    const items = await addToWishlist(req.customer.id, productId);
    res.status(201).json(items);
  } catch (err) {
    next(err);
  }
};

export const removeWishlistItem = async (req, res, next) => {
  try {
    const items = await removeFromWishlist(req.customer.id, req.params.productId);
    res.json(items);
  } catch (err) {
    next(err);
  }
};
