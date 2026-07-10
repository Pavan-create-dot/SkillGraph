import { Request, Response } from 'express';
import { resumeService } from '../services/resume.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';

// pdf-parse v2 API: pass bytes under `data` (not `buffer`) to PDFParse constructor
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PDFParse } = require('pdf-parse') as {
  PDFParse: new (opts: { data?: Buffer; verbosity?: number }) => {
    getText(): Promise<{ text: string }>;
  };
};

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

  if (req.file) {
    const ext = req.file.originalname.split('.').pop()?.toLowerCase();
    if (req.file.mimetype === 'application/pdf' || ext === 'pdf') {
      // pdf-parse v2: instantiate with buffer, then call getText()
      const parser = new PDFParse({ data: req.file.buffer, verbosity: 0 });
      const result = await parser.getText();
      resumeText = result.text;
    } else {
      // Plain text file
      resumeText = req.file.buffer.toString('utf-8');
    }
  } else {
    resumeText = req.body.resumeText;
  }

  if (!resumeText || resumeText.trim().length < 50) {
    throw ApiError.badRequest(
      req.file
        ? 'Could not extract sufficient text from the uploaded file. Please use a text-based PDF or .txt file.'
        : 'resumeText is required (minimum 50 characters)',
    );
  }

  const result = await resumeService.analyzeAndSaveResume(req.user.id, resumeText.trim());
  res.status(200).json(ApiResponse.ok('Resume analyzed and updated successfully', result));
});
