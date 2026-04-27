import { Request, Response } from 'express';
import { resumeService } from '../services/resume.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';

export const getResume = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized();
  }

  const result = await resumeService.getResumeAnalysis(req.user.id);
  res.status(200).json(ApiResponse.ok('Resume profile retrieved successfully', result));
});

export const analyzeResume = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized();
  }

  const { resumeText } = req.body;
  if (!resumeText) {
    throw ApiError.badRequest('resumeText is required');
  }

  const result = await resumeService.analyzeAndSaveResume(req.user.id, resumeText);
  res.status(200).json(ApiResponse.ok('Resume analyzed and updated successfully', result));
});
