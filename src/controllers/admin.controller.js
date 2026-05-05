import { approveCustomer, rejectCustomer } from '../services/admin.service.js';

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
