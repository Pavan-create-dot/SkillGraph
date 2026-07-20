import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { registerSchema, loginSchema, refreshTokenSchema } from '../validators/auth.validator';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { body } = registerSchema.parse({ body: req.body });
  const result = await authService.register(body);

  res.status(201).json(new ApiResponse(201, 'Account created successfully', result));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { body } = loginSchema.parse({ body: req.body });
  const result = await authService.login(body);

  res.status(200).json(ApiResponse.ok('Logged in successfully', result));
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  await authService.logout();

  res.status(200).json(ApiResponse.ok('Logged out successfully'));
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { body } = refreshTokenSchema.parse({ body: req.body });
  const tokens = await authService.refreshToken(body);

  res.status(200).json(ApiResponse.ok('Token refreshed successfully', tokens));
});
