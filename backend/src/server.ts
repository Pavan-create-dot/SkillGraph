import { env } from './config/env';
import { logger } from './config/logger';
import { connectDatabase, disconnectDatabase } from './config/database';
import createApp from './app';

const startServer = async (): Promise<void> => {
  // Connect to database first
  await connectDatabase();

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info({
      msg: '🚀 SkillGraph API server started',
      port: env.PORT,
      env: env.NODE_ENV,
      url: `http://localhost:${env.PORT}/api/v1`,
    });
  });

  // ─── Graceful Shutdown ─────────────────────────────────────────────────────
  const gracefulShutdown = async (signal: string): Promise<void> => {
    logger.info({ msg: `${signal} received — starting graceful shutdown` });

    server.close(async () => {
      logger.info('HTTP server closed');

      try {
        await disconnectDatabase();
        logger.info('Database disconnected');
        process.exit(0);
      } catch (error) {
        logger.error({ msg: 'Error during shutdown', error });
        process.exit(1);
      }
    });

    // Force close after 10s if graceful shutdown stalls
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // ─── Uncaught Exception Handling ──────────────────────────────────────────
  process.on('uncaughtException', (error: Error) => {
    logger.fatal({ msg: 'Uncaught exception', error: error.message, stack: error.stack });
    process.exit(1);
  });

  process.on('unhandledRejection', (reason: unknown) => {
    logger.fatal({ msg: 'Unhandled promise rejection', reason });
    process.exit(1);
  });
};

startServer().catch((error) => {
  logger.fatal({ msg: 'Failed to start server', error });
  process.exit(1);
});
