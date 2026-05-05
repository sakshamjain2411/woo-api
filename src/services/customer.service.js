import { supabase } from '../config/supabase.js';
import { woo } from '../config/woo.js';

export const loginCustomer = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw { status: 401, code: 'UNAUTHORIZED', message: error.message };
  return data;
};

export const fetchWooCustomer = async (wooId) => {
  const res = await woo.get(`/customers/${wooId}`);
  return res.data;
};

export const updateWooCustomer = async (wooId, updates) => {
  const res = await woo.put(`/customers/${wooId}`, updates);
  return res.data;
};
