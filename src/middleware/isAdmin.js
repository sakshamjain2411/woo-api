export const isAdmin = (req, res, next) => {
  if (!req.customer?.is_admin) {
    return res.status(403).json({
      error: { code: 'FORBIDDEN', message: 'Admin access required', status: 403 }
    });
  }
  next();
};
