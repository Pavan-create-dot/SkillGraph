import { Request, Response } from 'express';
import { skillRepository } from '../repositories/skill.repository';
import { graphService } from '../services/graph.service';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const createEdge = asyncHandler(async (req: Request, res: Response) => {
  const { parentSkillId, childSkillId } = req.body;

  // 1. Prevent self-dependencies
  if (parentSkillId === childSkillId) {
    throw ApiError.badRequest('A skill cannot depend on itself.');
  }

  // 2. Ensure both skills exist
  const [parentSkill, childSkill] = await Promise.all([
    skillRepository.findById(parentSkillId),
    skillRepository.findById(childSkillId),
  ]);

  if (!parentSkill) {
    throw ApiError.notFound('Parent skill not found.');
  }
  if (!childSkill) {
    throw ApiError.notFound('Child skill not found.');
  }

  // 3. Check if edge already exists
  const existingEdge = await skillRepository.findEdge(parentSkillId, childSkillId);
  if (existingEdge) {
    throw ApiError.conflict('This dependency edge already exists.');
  }

  // 4. Run cycle detection to ensure DAG status remains intact
  const wouldFormCycle = await graphService.hasCycle(parentSkillId, childSkillId);
  if (wouldFormCycle) {
    throw ApiError.badRequest(
      `Cannot add dependency: making '${childSkill.name}' depend on '${parentSkill.name}' would introduce a circular dependency.`
    );
  }

  // 5. Create edge
  const edge = await skillRepository.createEdge(parentSkillId, childSkillId);

  res.status(201).json(
    ApiResponse.created('Dependency edge created successfully', edge)
  );
});

export const deleteEdge = asyncHandler(async (req: Request, res: Response) => {
  const edgeId = req.params.edgeId as string;

  // Ensure edge exists
  const existingEdge = await skillRepository.findEdgeById(edgeId);
  if (!existingEdge) {
    throw ApiError.notFound('Dependency edge not found.');
  }

  await skillRepository.deleteEdge(edgeId);

  res.status(200).json(
    ApiResponse.ok('Dependency edge deleted successfully')
  );
});
