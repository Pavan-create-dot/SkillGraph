import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import resumeRoutes from './resume.routes';
import interviewRoutes from './interview.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/resume', resumeRoutes);
router.use('/interview', interviewRoutes);

export default router;
