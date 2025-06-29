import User from '../models/User.js';
import {
  signAccess,
  signRefresh,
  verifyRefresh
} from '../utils/token.js';
import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5
});

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email taken' });

  const user = await User.create({ name, email, password });
  res.status(201).json({ message: 'Registered', id: user._id });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ message: 'Invalid credentials' });

  const access = signAccess({ id: user._id, role: user.role });
  const refresh = signRefresh({ id: user._id });
  res.json({ access, refresh, role: user.role });
};

export const refreshToken = (req, res) => {
  try {
    const { token } = req.body;
    const payload = verifyRefresh(token);
    const access = signAccess({ id: payload.id, role: payload.role });
    res.json({ access });
  } catch {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const me = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};
