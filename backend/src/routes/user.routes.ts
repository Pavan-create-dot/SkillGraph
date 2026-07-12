import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// GET /api/v1/users/profile
router.get('/profile', userController.getProfile);

export default router;
