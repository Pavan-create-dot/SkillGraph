import { Router } from 'express';
import * as graphController from '../controllers/graph.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// All graph routes require authentication
router.use(authenticate);

// GET /api/v1/graph/prerequisites/:skillId
router.get('/prerequisites/:skillId', graphController.getPrerequisites);

// GET /api/v1/graph/tree/:skillId
router.get('/tree/:skillId', graphController.getSkillTree);

// GET /api/v1/graph/topological-order
router.get('/topological-order', graphController.getTopologicalOrder);

// GET /api/v1/graph/path
router.get('/path', graphController.getShortestPath);

export default router;
