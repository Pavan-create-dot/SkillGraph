import { Request, Response } from 'express';
import { interviewService } from '../services/interview.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';

export const startSession = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const { type } = req.body;
  const session = await interviewService.startSession(req.user.id, type || 'TECHNICAL');
  res.status(201).json(ApiResponse.ok('Interview session started successfully', session));
});

export const submitAnswer = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const { sessionId, questionId, userAnswer } = req.body;

  if (!sessionId || !questionId || !userAnswer) {
    throw ApiError.badRequest('sessionId, questionId, and userAnswer are required');
  }

  const question = await interviewService.submitAnswer(
    req.user.id,
    sessionId,
    questionId,
    userAnswer,
  );
  res.status(200).json(ApiResponse.ok('Answer submitted and evaluated', question));
});

export const getSession = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const id = req.params.id as string;
  const session = await interviewService.getSession(req.user.id, id);
  res.status(200).json(ApiResponse.ok('Interview session retrieved', session));
});

export const getHistory = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const history = await interviewService.getHistory(req.user.id);
  res.status(200).json(ApiResponse.ok('Interview history retrieved', history));
});
