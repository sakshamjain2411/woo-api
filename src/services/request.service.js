import { supabase } from '../config/supabase.js';

export const getRequestsForProduct = async (productId) => {
  const { data, error } = await supabase
    .from('product_requests')
    .select('id, product_id, user_id, status, created_at')
    .eq('product_id', productId)
    .in('status', ['pending', 'accepted']);
  if (error) throw error;
  return data;
};

export const getActiveProductIds = async () => {
  const { data, error } = await supabase
    .from('product_requests')
    .select('product_id')
    .eq('status', 'accepted');
  if (error) throw error;
  return data.map(r => r.product_id);
};

export const createRequest = async (productId, userId, productName, customerName, customerEmail) => {
  const { data, error } = await supabase
    .from('product_requests')
    .insert({ product_id: productId, user_id: userId, product_name: productName, customer_name: customerName, customer_email: customerEmail })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateRequestStatus = async (requestId, status) => {
  const { data, error } = await supabase
    .from('product_requests')
    .update({ status })
    .eq('id', requestId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const rejectOtherRequests = async (productId, acceptedRequestId) => {
  const { error } = await supabase
    .from('product_requests')
    .update({ status: 'rejected' })
    .eq('product_id', productId)
    .eq('status', 'pending')
    .neq('id', acceptedRequestId);
  if (error) throw error;
};

export const getRequestsByUser = async (userId) => {
  const { data, error } = await supabase
    .from('product_requests')
    .select('id, product_id, product_name, status, created_at, updated_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const getAllRequests = async () => {
  const { data, error } = await supabase
    .from('product_requests')
    .select('id, product_id, product_name, user_id, customer_name, customer_email, status, created_at, updated_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};
