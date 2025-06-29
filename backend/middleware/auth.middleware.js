import { verifyAccess } from '../utils/token.js';

export const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    req.user = verifyAccess(token);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};
