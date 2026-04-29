import { supabase } from '../config/supabase.js';
import { woo } from '../config/woo.js';

export const registerCustomer = async ({ email, password, firstName, lastName }) => {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });
  if (error) throw { status: 400, code: 'VALIDATION_ERROR', message: error.message };

  await woo.post('/customers', {
    email,
    first_name: firstName ?? '',
    last_name: lastName ?? '',
    password
  });

  return data.user;
};

export const loginCustomer = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw { status: 401, code: 'UNAUTHORIZED', message: error.message };
  return data;
};

export const findWooCustomerByEmail = async (email) => {
  const res = await woo.get('/customers', { params: { email } });
  return res.data[0] ?? null;
};

export const updateWooCustomer = async (email, updates) => {
  const customer = await findWooCustomerByEmail(email);
  if (!customer) throw { status: 404, code: 'NOT_FOUND', message: 'Customer not found in WooCommerce' };
  const res = await woo.put(`/customers/${customer.id}`, updates);
  return res.data;
};
