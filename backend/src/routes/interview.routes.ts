import { Router } from 'express';
import {
  startSession,
  submitAnswer,
  getSession,
  getHistory,
} from '../controllers/interview.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.post('/start', authenticate, startSession);
router.post('/answer', authenticate, submitAnswer);
router.get('/session/:id', authenticate, getSession);
router.get('/history', authenticate, getHistory);

export default router;
