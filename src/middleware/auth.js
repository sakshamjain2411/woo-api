import { supabase } from '../config/supabase.js';

export const auth = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token', status: 401 }
    });
  }

  const token = header.slice(7);

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return res.status(401).json({
        error: { code: 'UNAUTHORIZED', message: 'Token expired or invalid', status: 401 }
      });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('woo_customer_id, is_admin, full_name')
      .eq('id', data.user.id)
      .single();

    if (!profile) {
      return res.status(503).json({
        error: { code: 'PROFILE_NOT_FOUND', message: 'User profile not found', status: 503 }
      });
    }

    if (profile.woo_customer_id == null && !profile.is_admin) {
      return res.status(503).json({
        error: { code: 'WOO_ID_NOT_MAPPED', message: 'WooCommerce account not yet provisioned', status: 503 }
      });
    }

    req.customer = {
      id: data.user.id,
      email: data.user.email,
      full_name: profile.full_name ?? '',
      woo_customer_id: profile.woo_customer_id,
      is_admin: profile.is_admin
    };
    next();
  } catch (err) {
    next(err);
  }
};
