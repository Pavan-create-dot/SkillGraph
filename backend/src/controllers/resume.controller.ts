import { Request, Response } from 'express';
import { resumeService } from '../services/resume.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse') as (buffer: Buffer) => Promise<{ text: string }>;

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

  let resumeText: string | undefined;

  // Handle PDF file upload via multer
  if (req.file) {
    const ext = req.file.originalname.split('.').pop()?.toLowerCase();
    if (req.file.mimetype === 'application/pdf' || ext === 'pdf') {
      const parsed = await pdfParse(req.file.buffer);
      resumeText = parsed.text;
    } else {
      // Plain text file
      resumeText = req.file.buffer.toString('utf-8');
    }
  } else {
    // JSON body with resumeText field (backward compatible)
    resumeText = req.body.resumeText;
  }

  if (!resumeText || resumeText.trim().length < 50) {
    throw ApiError.badRequest(
      req.file
        ? 'Could not extract sufficient text from the uploaded file. Please try a text-based PDF or .txt file.'
        : 'resumeText is required (minimum 50 characters)',
    );
  }

  const result = await resumeService.analyzeAndSaveResume(req.user.id, resumeText.trim());
  res.status(200).json(ApiResponse.ok('Resume analyzed and updated successfully', result));
});
