import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authRateLimiter } from '../middleware/rateLimiter';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// POST /api/v1/auth/register
router.post('/register', authRateLimiter, authController.register);

// POST /api/v1/auth/login
router.post('/login', authRateLimiter, authController.login);

// POST /api/v1/auth/logout
router.post('/logout', authenticate, authController.logout);

// POST /api/v1/auth/refresh
router.post('/refresh', authRateLimiter, authController.refreshToken);

export default router;
