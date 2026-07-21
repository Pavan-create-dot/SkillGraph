import { Router } from 'express';
import * as careerGoalController from '../controllers/careerGoal.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// All career goal routes require authentication
router.use(authenticate);

router.get('/', careerGoalController.listCareerGoals);
router.post('/select', careerGoalController.selectCareerGoal);

export default router;
