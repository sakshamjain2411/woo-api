import { getCart, addCartItem, updateCartItem, removeCartItem, clearCart } from '../services/cart.service.js';
import { mapCart } from '../utils/mapper.js';

const withCartToken = (res, cartToken) => {
  if (cartToken) res.set('Cart-Token', cartToken);
};

export const fetchCart = async (req, res, next) => {
  try {
    const { data, cartToken } = await getCart(req.headers['cart-token']);
    withCartToken(res, cartToken);
    res.json(mapCart(data));
  } catch (err) {
    next(err);
  }
};

export const addItem = async (req, res, next) => {
  try {
    const { id, quantity, variation } = req.body;
    if (id == null || quantity == null) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'id and quantity are required', status: 400 } });
    }
    const { data, cartToken } = await addCartItem(req.headers['cart-token'], { id, quantity, variation });
    withCartToken(res, cartToken);
    res.status(201).json(mapCart(data));
  } catch (err) {
    next(err);
  }
};

export const updateItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (quantity == null) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'quantity is required', status: 400 } });
    }
    const { data, cartToken } = await updateCartItem(req.headers['cart-token'], req.params.key, quantity);
    withCartToken(res, cartToken);
    res.json(mapCart(data));
  } catch (err) {
    next(err);
  }
};

export const removeItem = async (req, res, next) => {
  try {
    const { data, cartToken } = await removeCartItem(req.headers['cart-token'], req.params.key);
    withCartToken(res, cartToken);
    res.json(mapCart(data));
  } catch (err) {
    next(err);
  }
};

export const emptyCart = async (req, res, next) => {
  try {
    const { data, cartToken } = await clearCart(req.headers['cart-token']);
    withCartToken(res, cartToken);
    res.json(mapCart(data));
  } catch (err) {
    next(err);
  }
};
