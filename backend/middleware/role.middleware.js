export const roleMiddleware = role => (req, res, next) => {
  if (req.user?.role !== role)
    return res.status(403).json({
      success: false,
      message: 'You are Forbidden'
    });
  next();
};
