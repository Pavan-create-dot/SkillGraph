import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import skillRoutes from './skill.routes';
import progressRoutes from './progress.routes';
import graphRoutes from './graph.routes';
import edgeRoutes from './edge.routes';
import roadmapRoutes from './roadmap.routes';
import careerGoalRoutes from './careerGoal.routes';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/skills', skillRoutes);
router.use('/progress', progressRoutes);
router.use('/graph', graphRoutes);
router.use('/edges', edgeRoutes);
router.use('/roadmap', roadmapRoutes);
router.use('/career-goals', careerGoalRoutes);

export default router;
