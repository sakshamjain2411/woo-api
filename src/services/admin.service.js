import { supabase } from '../config/supabase.js';
import { woo } from '../config/woo.js';

export const approveCustomer = async (supabaseUserId) => {
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, approval_status, full_name, woo_customer_id')
    .eq('id', supabaseUserId)
    .single();

  if (!profile) throw { status: 404, code: 'NOT_FOUND', message: 'Profile not found' };
  if (profile.approval_status === 'approved') throw { status: 409, code: 'CONFLICT', message: 'Customer already approved' };

  const { data: authData, error: authError } = await supabase.auth.admin.getUserById(supabaseUserId);
  if (authError || !authData?.user) throw { status: 500, code: 'INTERNAL_ERROR', message: 'Could not fetch user email' };

  const email = authData.user.email;
  const nameParts = (profile.full_name ?? '').trim().split(/\s+/);
  const first_name = nameParts[0] ?? '';
  const last_name = nameParts.slice(1).join(' ');

  const { data: wcCustomer } = await woo.post('/customers', { email, first_name, last_name });

  await supabase
    .from('profiles')
    .update({ woo_customer_id: wcCustomer.id, approval_status: 'approved' })
    .eq('id', supabaseUserId);

  return { message: 'approved', woo_customer_id: wcCustomer.id };
};

export const rejectCustomer = async (supabaseUserId, reason) => {
  await supabase
    .from('profiles')
    .update({ approval_status: 'rejected', rejection_reason: reason ?? null })
    .eq('id', supabaseUserId);

  return { message: 'rejected' };
};
