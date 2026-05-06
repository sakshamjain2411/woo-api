import { approveCustomer, rejectCustomer, getProfiles, getProfile } from '../services/admin.service.js';
import { fetchAllOrders, updateOrder } from '../services/order.service.js';
import { mapOrder } from '../utils/mapper.js';

export const listProfilesHandler = async (req, res, next) => {
  try {
    const { status } = req.query;
    const profiles = await getProfiles(status);
    res.json(profiles);
  } catch (err) {
    next(err);
  }
};

export const getProfileHandler = async (req, res, next) => {
  try {
    const profile = await getProfile(req.params.id);
    res.json(profile);
  } catch (err) {
    next(err);
  }
};

export const approveCustomerHandler = async (req, res, next) => {
  try {
    const result = await approveCustomer(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const rejectCustomerHandler = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const result = await rejectCustomer(req.params.id, reason);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const listOrdersHandler = async (req, res, next) => {
  try {
    const orders = await fetchAllOrders();
    res.json(orders.map(mapOrder));
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatusHandler = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await updateOrder(req.params.id, { status });
    res.json(mapOrder(order));
  } catch (err) {
    next(err);
  }
};
