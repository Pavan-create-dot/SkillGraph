import { Router, Request, Response } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import skillRoutes from './skill.routes';
import careerGoalRoutes from './careerGoal.routes';
import progressRoutes from './progress.routes';

const router = Router();

// Health check endpoint
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'SkillGraph API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/skills', skillRoutes);
router.use('/career-goals', careerGoalRoutes);
router.use('/progress', progressRoutes);

export default router;
