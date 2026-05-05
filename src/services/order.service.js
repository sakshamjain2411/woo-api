import { woo } from '../config/woo.js';

export const fetchOrdersByCustomerId = async (wooId) => {
  const res = await woo.get('/orders', { params: { customer: wooId, per_page: 50 } });
  return res.data;
};

export const fetchOrderById = async (id) => {
  const res = await woo.get(`/orders/${id}`);
  return res.data;
};

export const createOrder = async (orderData) => {
  const res = await woo.post('/orders', orderData);
  return res.data;
};

export const updateOrder = async (id, orderData) => {
  const res = await woo.put(`/orders/${id}`, orderData);
  return res.data;
};
