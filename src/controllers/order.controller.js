import { fetchOrdersByEmail, fetchOrderById, createOrder, updateOrder } from '../services/order.service.js';
import { mapOrder } from '../utils/mapper.js';

export const listOrders = async (req, res, next) => {
  try {
    const orders = await fetchOrdersByEmail(req.customer.email);
    res.json(orders.map(mapOrder));
  } catch (err) {
    next(err);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await fetchOrderById(req.params.id);
    if (order.billing?.email !== req.customer.email) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Access denied', status: 403 } });
    }
    res.json(mapOrder(order));
  } catch (err) {
    next(err);
  }
};

export const placeOrder = async (req, res, next) => {
  try {
    const order = await createOrder(req.body);
    res.status(201).json(mapOrder(order));
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await updateOrder(req.params.id, req.body);
    res.json(mapOrder(order));
  } catch (err) {
    next(err);
  }
};
