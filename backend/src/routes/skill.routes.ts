import { Router } from 'express';
import * as skillController from '../controllers/skill.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// All skill routes require authentication
router.use(authenticate);

// GET /api/v1/skills
router.get('/', skillController.listSkills);

// GET /api/v1/skills/categories
router.get('/categories', skillController.listCategories);

export default router;
