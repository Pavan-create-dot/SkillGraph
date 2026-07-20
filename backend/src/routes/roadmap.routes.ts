import { Router } from 'express';
import * as roadmapController from '../controllers/roadmap.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// All roadmap routes require authentication
router.use(authenticate);

// GET /api/v1/roadmap/status — check if user has a roadmap
router.get('/status', roadmapController.getRoadmapStatus);

// GET /api/v1/roadmap/mine — get user's personal roadmap
router.get('/mine', roadmapController.getMyRoadmap);

// POST /api/v1/roadmap/generate — generate roadmap via Gemini AI
router.post('/generate', roadmapController.generateRoadmap);

export default router;
