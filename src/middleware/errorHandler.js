export const errorHandler = (err, req, res, next) => {
  if (err.response) {
    return res.status(err.response.status).json({
      error: {
        code: 'WOO_ERROR',
        message: err.response.data?.message || 'WooCommerce error',
        status: err.response.status
      }
    });
  }

  const status = err.status || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'An unexpected error occurred';

  res.status(status).json({ error: { code, message, status } });
};
