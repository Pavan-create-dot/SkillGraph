import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { env } from './config/env';
import { logger } from './config/logger';
import { rateLimiter } from './middleware/rateLimiter';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import apiRoutes from './routes';

const createApp = (): Application => {
  const app = express();

  // ─── Security Middleware ───────────────────────────────────────────────────
  app.use(
    helmet({
      contentSecurityPolicy: env.NODE_ENV === 'production',
      crossOriginEmbedderPolicy: env.NODE_ENV === 'production',
    }),
  );

  // Support comma-separated list of origins: e.g. "http://localhost:5173,https://skillgraph.vercel.app"
  const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Render health checks)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`CORS: origin '${origin}' not allowed`));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  // ─── Request Parsing ───────────────────────────────────────────────────────
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // ─── Logging ──────────────────────────────────────────────────────────────
  if (env.NODE_ENV !== 'test') {
    app.use(requestLogger);
  }

  if (env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // ─── Rate Limiting ────────────────────────────────────────────────────────
  app.use(rateLimiter);

  // ─── Trust Proxy (for correct IP behind reverse proxy) ───────────────────
  app.set('trust proxy', 1);

  // ─── API Routes ───────────────────────────────────────────────────────────
  app.use('/api/v1', apiRoutes);

  // ─── 404 Handler ──────────────────────────────────────────────────────────
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      statusCode: 404,
      message: `Route '${req.method} ${req.originalUrl}' not found`,
      timestamp: new Date().toISOString(),
    });
  });

  // ─── Centralized Error Handler ────────────────────────────────────────────
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err, req, res, next);
  });

  return app;
};

export default createApp;
