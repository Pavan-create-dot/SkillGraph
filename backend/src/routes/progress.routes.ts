import { Router } from 'express';
import * as progressController from '../controllers/progress.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// All progress routes require authentication
router.use(authenticate);

// GET /api/v1/progress
router.get('/', progressController.getUserProgress);

// PUT /api/v1/progress/:skillId
router.put('/:skillId', progressController.upsertProgress);

export default router;
