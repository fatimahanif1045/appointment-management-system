// routes/auth.routes.js
import { Router } from 'express';
import {
  register,
  login,
  refreshToken,
  me,
  validateRegister,
  validateLogin,
  limiter
} from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', limiter, validateLogin, login);
router.post('/refresh-token', refreshToken);
router.get('/me', authMiddleware, me);

export default router;
