// middleware/error.middleware.js
export const errorHandler = (err, _req, res, _next) => {
  console.error(err);               // log once
  res.status(500).json({ message: 'Server error' });
};
