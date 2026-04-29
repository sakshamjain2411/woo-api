import { woo } from '../config/woo.js';

export const fetchOrdersByEmail = async (email) => {
  const customers = await woo.get('/customers', { params: { email } });
  const wcCustomer = customers.data[0];
  if (!wcCustomer) return [];
  const res = await woo.get('/orders', { params: { customer: wcCustomer.id, per_page: 50 } });
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
