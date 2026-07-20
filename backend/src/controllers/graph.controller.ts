import { Request, Response } from 'express';
import { graphService } from '../services/graph.service';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getPrerequisites = asyncHandler(async (req: Request, res: Response) => {
  const skillId = req.params.skillId as string;

  try {
    const prerequisites = await graphService.getPrerequisiteChain(skillId);
    res
      .status(200)
      .json(ApiResponse.ok('Prerequisite chain retrieved successfully', prerequisites));
  } catch (error: any) {
    if (error.message === 'Skill not found') {
      throw ApiError.notFound('Skill not found');
    }
    throw error;
  }
});

export const getSkillTree = asyncHandler(async (req: Request, res: Response) => {
  const skillId = req.params.skillId as string;

  try {
    const tree = await graphService.getSkillTree(skillId);
    res.status(200).json(ApiResponse.ok('Skill downstream tree retrieved successfully', tree));
  } catch (error: any) {
    if (error.message === 'Skill not found') {
      throw ApiError.notFound('Skill not found');
    }
    throw error;
  }
});

export const getTopologicalOrder = asyncHandler(async (_req: Request, res: Response) => {
  const order = await graphService.getTopologicalOrder();
  res.status(200).json(ApiResponse.ok('Topological sort order retrieved successfully', order));
});

export const getShortestPath = asyncHandler(async (req: Request, res: Response) => {
  const fromId = req.query.from as string;
  const toId = req.query.to as string;

  if (!fromId || !toId) {
    throw ApiError.badRequest("Query parameters 'from' and 'to' are required.");
  }

  try {
    const path = await graphService.getShortestPath(fromId, toId);

    if (!path) {
      res.status(200).json(ApiResponse.ok('No path exists between these skills', []));
      return;
    }

    res.status(200).json(ApiResponse.ok('Shortest path calculated successfully', path));
  } catch (error: any) {
    if (error.message === 'Invalid start or end skill ID') {
      throw ApiError.badRequest('Invalid start or end skill ID provided.');
    }
    throw error;
  }
});
