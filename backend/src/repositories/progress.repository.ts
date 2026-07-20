import { prisma } from '../config/database';
import { Prisma } from '@prisma/client';

export class ProgressRepository {
  async findByUserId(userId: string) {
    return prisma.progress.findMany({
      where: { userId },
      include: {
        skill: true,
      },
    });
  }

  async upsert(
    userId: string,
    skillId: string,
    mastery: number,
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED',
  ) {
    return prisma.progress.upsert({
      where: {
        userId_skillId: {
          userId,
          skillId,
        },
      },
      update: {
        mastery,
        status,
      },
      create: {
        userId,
        skillId,
        mastery,
        status,
      },
    });
  }
}

export const progressRepository = new ProgressRepository();
