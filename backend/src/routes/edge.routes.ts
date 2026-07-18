import { Router } from 'express';
import * as edgeController from '../controllers/edge.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { createEdgeSchema } from '../validators/edge.validator';
import { Role } from '../types';

const router = Router();

// All edge routes require authentication and admin role
router.use(authenticate, authorize(Role.ADMIN));

// POST /api/v1/edges
router.post('/', validate(createEdgeSchema), edgeController.createEdge);

// DELETE /api/v1/edges/:edgeId
router.delete('/:edgeId', edgeController.deleteEdge);

export default router;
