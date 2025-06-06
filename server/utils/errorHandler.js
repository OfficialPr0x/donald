function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    details: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
}

module.exports = { errorHandler }; 