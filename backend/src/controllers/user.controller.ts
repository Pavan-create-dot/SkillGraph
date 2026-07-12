import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized();
  }

  const user = await userService.getProfile(req.user.id);

  res.status(200).json(
    ApiResponse.ok('Profile retrieved successfully', user),
  );
});
