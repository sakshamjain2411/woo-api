import { store } from '../config/store.js';

const cartHeaders = (cartToken) =>
  cartToken ? { 'Cart-Token': cartToken } : {};

export const getCart = async (cartToken) => {
  const res = await store.get('/cart', { headers: cartHeaders(cartToken) });
  return { data: res.data, cartToken: res.headers['cart-token'] };
};

export const addCartItem = async (cartToken, body) => {
  const res = await store.post('/cart/add-item', body, { headers: cartHeaders(cartToken) });
  return { data: res.data, cartToken: res.headers['cart-token'] };
};

export const updateCartItem = async (cartToken, key, quantity) => {
  const res = await store.post('/cart/update-item', { key, quantity }, { headers: cartHeaders(cartToken) });
  return { data: res.data, cartToken: res.headers['cart-token'] };
};

export const removeCartItem = async (cartToken, key) => {
  const res = await store.post('/cart/remove-item', { key }, { headers: cartHeaders(cartToken) });
  return { data: res.data, cartToken: res.headers['cart-token'] };
};

export const clearCart = async (cartToken) => {
  const res = await store.delete('/cart/items', { headers: cartHeaders(cartToken) });
  return { data: res.data, cartToken: res.headers['cart-token'] };
};
