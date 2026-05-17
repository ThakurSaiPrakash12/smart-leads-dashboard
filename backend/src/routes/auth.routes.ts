import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, logout, getMe } from '../controllers/auth.controller';
import { protect } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validateRequest';
import { registerSchema, loginSchema } from '../validators/auth.validators';
import { ENV } from '../config/env';

const loginLimiter = rateLimit({
  windowMs: ENV.LOGIN_RATE_WINDOW_MIN * 60 * 1000,
  max: ENV.LOGIN_RATE_MAX,
  message: {
    success: false,
    message: `Too many login attempts. Try again in ${ENV.LOGIN_RATE_WINDOW_MIN} minutes.`,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: ENV.REGISTER_RATE_WINDOW_MIN * 60 * 1000,
  max: ENV.REGISTER_RATE_MAX,
  message: {
    success: false,
    message: `Too many accounts created. Try again in ${ENV.REGISTER_RATE_WINDOW_MIN} minutes.`,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();

router.post('/register', registerLimiter, validateRequest(registerSchema), register);
router.post('/login', loginLimiter, validateRequest(loginSchema), login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;
