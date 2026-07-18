import { Request, Response } from 'express';
import { skillService } from '../services/skill.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const listSkills = asyncHandler(async (req: Request, res: Response) => {
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
  const category = req.query.category as string | undefined;

  const result = await skillService.listSkills({ page, limit, category });

  res.status(200).json(
    ApiResponse.ok('Skills retrieved successfully', result),
  );
});

export const listCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await skillService.getCategories();

  res.status(200).json(
    ApiResponse.ok('Categories retrieved successfully', categories),
  );
});

export const getGraph = asyncHandler(async (_req: Request, res: Response) => {
  const graphData = await skillService.getGraphData();

  res.status(200).json(
    ApiResponse.ok('Skill graph retrieved successfully', graphData),
  );
});
