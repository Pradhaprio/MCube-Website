export function errorHandler(error, req, res, next) {
  console.error(error);
  res.status(500).json({
    message: 'Something went wrong.',
    detail: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
}
