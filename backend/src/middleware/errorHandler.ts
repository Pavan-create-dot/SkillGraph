import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { ApiError } from '../utils/ApiError';
import { logger } from '../config/logger';
import { env } from '../config/env';

interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
  stack?: string;
  timestamp: string;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const timestamp = new Date().toISOString();

  // Print full error log to console for Production diagnostics (Render logs)
  console.error(`[ERROR] [${req.method} ${req.path}]:`, err);

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    err.issues.forEach((issue) => {
      const field = issue.path.length > 0 ? String(issue.path[issue.path.length - 1]) : 'unknown';
      if (!errors[field]) {
        errors[field] = [];
      }
      errors[field].push(issue.message);
    });

    logger.warn({ msg: 'Validation error', path: req.path, errors });

    const response: ErrorResponse = {
      success: false,
      statusCode: 400,
      message: 'Validation failed',
      errors,
      timestamp,
    };
    res.status(400).json(response);
    return;
  }

  // Handle known operational errors
  if (err instanceof ApiError) {
    if (err.statusCode >= 500) {
      logger.error({ msg: err.message, path: req.path, stack: err.stack });
    } else {
      logger.warn({ msg: err.message, path: req.path, statusCode: err.statusCode });
    }

    const response: ErrorResponse = {
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
      timestamp,
      ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    };
    res.status(err.statusCode).json(response);
    return;
  }

  // Handle Prisma errors
  if (
    err instanceof Prisma.PrismaClientKnownRequestError ||
    err.name === 'PrismaClientKnownRequestError'
  ) {
    const prismaError = err as Prisma.PrismaClientKnownRequestError;
    if (prismaError.code === 'P2002') {
      res.status(409).json({
        success: false,
        statusCode: 409,
        message: 'An account or record with that value already exists',
        timestamp,
      });
      return;
    }
    if (prismaError.code === 'P2025') {
      res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Record not found',
        timestamp,
      });
      return;
    }
  }

  if (
    err instanceof Prisma.PrismaClientInitializationError ||
    err.name === 'PrismaClientInitializationError'
  ) {
    logger.error({ msg: 'Database Connection Error', error: err.message });
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Database connection failed. Please check server database configuration.',
      timestamp,
    });
    return;
  }

  // Unknown / unhandled errors
  logger.error({ msg: 'Unhandled error', error: err.message, stack: err.stack, path: req.path });

  const response: ErrorResponse = {
    success: false,
    statusCode: 500,
    message: env.NODE_ENV === 'production' ? err.message || 'Internal server error' : err.message,
    timestamp,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  };
  res.status(500).json(response);
};
