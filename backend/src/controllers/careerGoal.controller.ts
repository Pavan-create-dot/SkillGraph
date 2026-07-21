import { Request, Response } from 'express';
import { careerGoalService } from '../services/careerGoal.service';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { selectCareerGoalSchema } from '../validators/careerGoal.validator';

export const listCareerGoals = asyncHandler(async (_req: Request, res: Response) => {
  const goals = await careerGoalService.list();
  res.status(200).json(ApiResponse.ok('Career goals retrieved successfully', goals));
});

export const selectCareerGoal = asyncHandler(async (req: Request, res: Response) => {
  const { body } = selectCareerGoalSchema.parse({ body: req.body });

  if (!req.user) {
    throw ApiError.unauthorized('Authentication required');
  }

  const userId = req.user.id;
  const selectedGoal = await careerGoalService.selectCareerGoal(userId, body.careerGoalId);

  res.status(200).json(ApiResponse.ok('Career goal selected successfully', selectedGoal));
});
