import { Router } from 'express';
import { getResume, analyzeResume } from '../controllers/resume.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.get('/', authenticate, getResume);
router.post('/analyze', authenticate, analyzeResume);

export default router;
