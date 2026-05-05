import { store } from '../config/store.js';

const cartHeaders = (cartToken) =>
  cartToken ? { 'Cart-Token': cartToken } : {};

const fetchNonce = async (cartToken) => {
  const res = await store.get('/cart', { headers: cartHeaders(cartToken) });
  return {
    nonce: res.headers['nonce'],
    cartToken: res.headers['cart-token'] ?? cartToken,
  };
};

const mutationHeaders = async (cartToken) => {
  const { nonce, cartToken: freshToken } = await fetchNonce(cartToken);
  return { headers: { ...cartHeaders(freshToken), Nonce: nonce }, cartToken: freshToken };
};

export const getCart = async (cartToken) => {
  const res = await store.get('/cart', { headers: cartHeaders(cartToken) });
  return { data: res.data, cartToken: res.headers['cart-token'] };
};

export const addCartItem = async (cartToken, body) => {
  const { headers, cartToken: freshToken } = await mutationHeaders(cartToken);
  const res = await store.post('/cart/add-item', body, { headers });
  return { data: res.data, cartToken: res.headers['cart-token'] ?? freshToken };
};

export const updateCartItem = async (cartToken, key, quantity) => {
  const { headers, cartToken: freshToken } = await mutationHeaders(cartToken);
  const res = await store.post('/cart/update-item', { key, quantity }, { headers });
  return { data: res.data, cartToken: res.headers['cart-token'] ?? freshToken };
};

export const removeCartItem = async (cartToken, key) => {
  const { headers, cartToken: freshToken } = await mutationHeaders(cartToken);
  const res = await store.post('/cart/remove-item', { key }, { headers });
  return { data: res.data, cartToken: res.headers['cart-token'] ?? freshToken };
};

export const clearCart = async (cartToken) => {
  const { headers, cartToken: freshToken } = await mutationHeaders(cartToken);
  const res = await store.delete('/cart/items', { headers });
  return { data: res.data, cartToken: res.headers['cart-token'] ?? freshToken };
};
