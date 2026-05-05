import { loginCustomer, fetchWooCustomer, updateWooCustomer } from '../services/customer.service.js';
import { mapCustomer } from '../utils/mapper.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'email and password are required', status: 400 } });
    }
    const { session, user } = await loginCustomer(email, password);
    if (!session) {
      return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Login failed', status: 401 } });
    }
    res.json({ token: session.access_token, user: { id: user.id, email: user.email } });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const customer = await fetchWooCustomer(req.customer.woo_customer_id);
    res.json(mapCustomer(customer));
  } catch (err) {
    next(err);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const { firstName, lastName, billing, shipping } = req.body;
    const updates = {};
    if (firstName !== undefined) updates.first_name = firstName;
    if (lastName !== undefined) updates.last_name = lastName;
    if (billing !== undefined) updates.billing = billing;
    if (shipping !== undefined) updates.shipping = shipping;
    const customer = await updateWooCustomer(req.customer.woo_customer_id, updates);
    res.json(mapCustomer(customer));
  } catch (err) {
    next(err);
  }
};
