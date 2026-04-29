import { supabase } from '../config/supabase.js';

export const auth = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token', status: 401 }
    });
  }

  const token = header.slice(7);
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Token expired or invalid', status: 401 }
    });
  }

  req.customer = data.user;
  next();
};
