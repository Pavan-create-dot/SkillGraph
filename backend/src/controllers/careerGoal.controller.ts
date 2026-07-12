import { Request, Response } from 'express';
import { careerGoalService } from '../services/careerGoal.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { selectCareerGoalSchema } from '../validators/careerGoal.validator';

export const listCareerGoals = asyncHandler(async (_req: Request, res: Response) => {
  const careerGoals = await careerGoalService.listCareerGoals();

  res.status(200).json(
    ApiResponse.ok('Career goals retrieved successfully', careerGoals),
  );
});

export const selectCareerGoal = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized();
  }

  const { body } = selectCareerGoalSchema.parse({ body: req.body });
  const result = await careerGoalService.selectCareerGoal(req.user.id, body);

  res.status(200).json(
    ApiResponse.ok(result.message, result.careerGoal),
  );
});
