import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'event', level: 'error' },
      { emit: 'event', level: 'warn' },
    ],
  });

type PrismaEventListener = {
  $on: (event: 'error' | 'warn', listener: (e: unknown) => void) => void;
};

const prismaEventListener = prisma as PrismaEventListener;

prismaEventListener.$on('error', (e) => {
  const errorMessage = e instanceof Error ? e.message : String(e);
  logger.error({ msg: 'Prisma error', error: errorMessage });
});

prismaEventListener.$on('warn', (e) => {
  const warningMessage = e instanceof Error ? e.message : String(e);
  logger.warn({ msg: 'Prisma warning', warning: warningMessage });
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
  } catch (error) {
    logger.error({ msg: '❌ Database connection failed', error });
    process.exit(1);
  }
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  logger.info('Database disconnected');
}
