import { Router } from 'express';
import {
  register,
  login,
  refreshToken,
  me,
  limiter
} from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', limiter, login);      // rate‑limited
router.post('/refresh-token', refreshToken);
router.get('/me', authMiddleware, me);

export default router;
