// controllers/auth.controller.js
import User from '../models/User.js';
import {
  signAccess,
  signRefresh,
  verifyRefresh
} from '../utils/token.js';
import rateLimit from 'express-rate-limit';
import { validationResult, body } from 'express-validator';

/*──────────────────────── 1. Rate‑limiter ────────────────────────*/
export const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { message: 'Too many requests, please try again later.' }
});

/*──────────────────────── 2. Input validators ────────────────────*/
export const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

export const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

/*──────────────────────── 3. Helpers ─────────────────────────────*/
const validationError = res =>
  res.status(422).json({ errors: validationResult(res.req).array() });

const tryCatch =
  fn =>
    (req, res, next) =>
      Promise.resolve(fn(req, res, next)).catch(next);

/*──────────────────────── 4. Controllers ─────────────────────────*/
export const register = tryCatch(async (req, res) => {
  if (!validationResult(req).isEmpty()) return validationError(res);

  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email already in use' });

  const user = await User.create({ name, email, password, role });
  res.status(201).json({ message: 'Registered', id: user._id });
});

export const login = tryCatch(async (req, res) => {
  if (!validationResult(req).isEmpty()) return validationError(res);

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ message: 'Invalid credentials' });

  const access = signAccess({ id: user._id, role: user.role });
  const refresh = signRefresh({ id: user._id });
  res.json({ access, refresh, role: user.role });
});

export const refreshToken = tryCatch(async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: 'Token required' });

  let payload;
  try {
    payload = verifyRefresh(token);
  } catch {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  const access = signAccess({ id: payload.id, role: payload.role });
  res.json({ access });
});

export const me = tryCatch(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});
