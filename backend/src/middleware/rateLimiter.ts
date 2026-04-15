import rateLimit from 'express-rate-limit';
import { env } from '../config/env';
import { logger } from '../config/logger';

export const rateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/api/v1/health' || req.path === '/health',
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many requests, please try again later.',
    timestamp: new Date().toISOString(),
  },
  handler: (req, res, _next, options) => {
    logger.warn({
      msg: 'Rate limit exceeded',
      ip: req.ip,
      path: req.path,
      method: req.method,
    });
    res.status(options.statusCode).json(options.message);
  },
});

// Stricter limiter for auth endpoints
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
    timestamp: new Date().toISOString(),
  },
  handler: (req, res, _next, options) => {
    logger.warn({
      msg: 'Auth rate limit exceeded',
      ip: req.ip,
      path: req.path,
    });
    res.status(options.statusCode).json(options.message);
  },
});
