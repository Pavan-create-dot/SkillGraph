import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { UpdateProfileInput } from '../validators/user.validator';

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized();
  }

  const user = await userService.getProfile(req.user.id);

  res.status(200).json(ApiResponse.ok('Profile retrieved successfully', user));
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized();
  }

  const payload = req.body as UpdateProfileInput;
  const updatedUser = await userService.updateProfile(req.user.id, payload);

  res.status(200).json(ApiResponse.ok('Profile updated successfully', updatedUser));
});
