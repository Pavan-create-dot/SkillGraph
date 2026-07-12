import { Router } from 'express';
import * as careerGoalController from '../controllers/careerGoal.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// All career goal routes require authentication
router.use(authenticate);

// GET /api/v1/career-goals
router.get('/', careerGoalController.listCareerGoals);

// POST /api/v1/career-goals/select
router.post('/select', careerGoalController.selectCareerGoal);

export default router;
