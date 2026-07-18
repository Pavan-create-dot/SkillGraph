import { Request, Response } from 'express';
import { progressService } from '../services/progress.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';

export const getUserProgress = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized();
  }

  const progress = await progressService.getUserProgress(req.user.id);

  res.status(200).json(
    ApiResponse.ok('User progress retrieved successfully', progress),
  );
});

export const upsertProgress = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized();
  }

  const { skillId } = req.params;
  const { mastery, status } = req.body;

  if (typeof mastery !== 'number' || mastery < 0 || mastery > 100) {
    throw ApiError.badRequest('Mastery must be a number between 0 and 100');
  }

  if (!['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'].includes(status)) {
    throw ApiError.badRequest('Invalid status');
  }

  const updatedProgress = await progressService.upsertProgress(req.user.id, skillId as string, mastery, status);

  res.status(200).json(
    ApiResponse.ok('Progress updated successfully', updatedProgress),
  );
});
